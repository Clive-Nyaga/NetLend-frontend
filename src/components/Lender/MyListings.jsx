import { useState, useEffect } from 'react';
import api from '../../services/api';
import ImageUpload from '../ImageUpload';

const MyListings = ({ lenderId, user }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'apartment',
    address: '',
    county: '',
    price_range: '',
    interest_rate: '',
    repayment_period: '30',
    minimum_income: '',
    down_payment: '',
    bedrooms: '2',
    description: '',
    images: [],
    imageUrls: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [editingListing, setEditingListing] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadListings();
  }, [lenderId]);

  const loadListings = async () => {
    try {
      const response = await api.getLenderListings(lenderId);
      console.log('Received response in component:', response);
      console.log('First listing structure:', response[0]);
      // Handle both array format and object format
      if (Array.isArray(response)) {
        setListings(response);
      } else {
        setListings(response.listings || []);
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 5) {
      setFormError('Please select exactly 5 images');
      e.target.value = '';
      return;
    }
    setFormError('');
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');
    // Temporarily skip image validation
    // if (formData.images.length !== 5) {
    //   setFormError('Please upload exactly 5 images');
    //   return;
    // }
    if (!formData.title || formData.title.trim() === '') {
      setFormError('Please enter a property title');
      return;
    }
    
    setSubmitting(true);
    try {
      const submitData = {
        lender_id: parseInt(lenderId),
        subject: String(formData.title).trim(),
        property_type: String(formData.property_type),
        address: String(formData.address),
        county: String(formData.county),
        price_range: parseFloat(formData.price_range) || 0,
        interest_rate: parseFloat(formData.interest_rate) || 0,
        repayment_period: parseInt(formData.repayment_period) || 30,
        minimum_income: parseFloat(formData.minimum_income) || 0,
        down_payment: parseFloat(formData.down_payment) || 20,
        bedrooms: parseInt(formData.bedrooms) || 2,
        description: String(formData.description).trim(),
        images: formData.imageUrls || []
      };
      
      console.log('Submitting minimal data:', submitData);
      console.log('Subject type:', typeof submitData.subject);
      console.log('Subject value:', JSON.stringify(submitData.subject));
      
      if (editingListing) {
        await api.updateMortgageListing(editingListing.id, submitData);
        setFormMessage('Listing updated successfully!');
      } else {
        await api.createMortgageListing(submitData);
        setFormMessage('Listing created successfully!');
      }
      
      setTimeout(() => {
        handleCloseForm();
      }, 2000);
      setFormData({
        title: '',
        property_type: 'apartment',
        address: '',
        county: '',
        price_range: '',
        interest_rate: '',
        repayment_period: '30',
        minimum_income: '',
        down_payment: '',
        bedrooms: '2',
        description: '',
        images: []
      });
      loadListings();
    } catch (error) {
      console.error('Failed to create listing:', error);
      setFormError('Failed to create listing: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditListing = (listing) => {
    if (listing.editable === false || listing.status === 'acquired' || listing.status === 'sold') {
      alert('Cannot edit this property as it has already been acquired or sold. You can view it in the "Sold Mortgages" section.');
      return;
    }
    setEditingListing(listing);
    setFormData({
      title: listing.title || '',
      property_type: listing.property_type || 'apartment',
      address: listing.address || '',
      county: listing.county || '',
      price_range: listing.price_range || '',
      interest_rate: listing.interest_rate || '',
      repayment_period: listing.repayment_period || '30',
      minimum_income: listing.minimum_income || '',
      down_payment: listing.down_payment || '',
      bedrooms: listing.bedrooms || '2',
      description: listing.description || '',
      images: []
    });
    setShowAddForm(true);
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.deleteMortgageListing(listingId);
        setFormMessage('Listing deleted successfully!');
        setTimeout(() => setFormMessage(''), 3000);
        loadListings();
      } catch (error) {
        console.error('Failed to delete listing:', error);
        setFormError('Failed to update status: ' + error.message);
        setTimeout(() => setFormError(''), 3000);
      }
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingListing(null);
    setFormData({
      title: '',
      property_type: 'apartment',
      address: '',
      county: '',
      price_range: '',
      interest_rate: '',
      repayment_period: '30',
      minimum_income: '',
      down_payment: '',
      bedrooms: '2',
      description: '',
      images: []
    });
    setFormError('');
    setFormMessage('');
  };

  return (
    <div className="section">
      <h2>My Mortgage Listings</h2>
      <button className="btn" onClick={() => setShowAddForm(true)}>
        Add Mortgage Offer
      </button>
      
      <div className="listings-grid">
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p>No listings yet. Create your first mortgage offer!</p>
        ) : (
          <>
            {(showAll ? listings : listings.slice(0, 3)).map((listing, index) => {
              console.log('Listing data:', listing);
              console.log('Available fields:', Object.keys(listing));
              console.log('Listing images field:', listing.images);
              return (
              <div key={index} className="listing-card">
              <img 
                src={listing.images && listing.images.length > 0 ? listing.images[0] : `https://picsum.photos/400/200?random=${index}`} 
                alt={listing.title || 'Property'}
                className="property-image"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = `https://via.placeholder.com/400x200/0057B7/ffffff?text=Property+Image`;
                }}
              />
              <div className="listing-content">
                <h3>{listing.title || 'Property Listing'}</h3>
                <p><strong>Location:</strong> {listing.location}</p>
                <p><strong>Price:</strong> KSH {listing.price?.toLocaleString()}</p>
                <p><strong>Interest Rate:</strong> {listing.rate}%</p>
                <p><strong>Term:</strong> {listing.term} years</p>
                <p><strong>Type:</strong> {listing.type}</p>
                <p><strong>Bedrooms:</strong> {listing.bedrooms || listing.rooms || 'Not specified'}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${listing.status?.toLowerCase() || 'active'}`}>
                    {listing.status === 'acquired' ? 'Under Contract' : 
                     listing.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </p>
                {listing.amount_paid > 0 && (
                  <p><strong>Payment Progress:</strong> 
                    KSH {(listing.amount_paid || 0).toLocaleString()} / KSH {(listing.price || listing.price_range || 0).toLocaleString()}
                    ({Math.round(((listing.amount_paid || 0) / (listing.price || listing.price_range || 1)) * 100)}%)
                  </p>
                )}
                <p><strong>Created:</strong> {listing.createdAt}</p>
                <div className="listing-actions">
                  <button className="btn" onClick={() => handleEditListing(listing)}>
                    {listing.editable !== false ? 'Edit' : 'Edit (Locked)'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => alert(`Property Analytics:\n\nViews: ${listing.views || 0}\nApplications: ${listing.applications || 0}\nInterest Level: ${listing.interest_level || 'Medium'}\n\nDetailed analytics coming soon!`)}>View Analytics</button>
                  <button className="btn danger" onClick={() => handleDeleteListing(listing.id)}>Remove</button>
                </div>
              </div>
            </div>
            );
          })}
          {!showAll && listings.length > 3 && (
            <div style={{textAlign: 'center', marginTop: '2rem', gridColumn: '1 / -1'}}>
              <button className="btn btn-secondary" onClick={() => setShowAll(true)}>
                View More ({listings.length - 3} more)
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {showAddForm && (
        <div className="modal show">
          <div className="modal-content" style={{maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden'}}>
            <span className="close" onClick={handleCloseForm}>&times;</span>
            <h2>{editingListing ? 'Edit Mortgage Offer' : 'Add Mortgage Offer'}</h2>
            <div style={{maxHeight: '75vh', overflowY: 'auto', paddingRight: '1rem'}}>
              {formError && (
                <div style={{background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>
                  {formError}
                </div>
              )}
              {formMessage && (
                <div style={{background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>
                  {formMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Property Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Modern 3BR Apartment" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select 
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Property Address (Required)</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Westlands" 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>County (Required)</label>
                  <select 
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select County</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Kajiado">Kajiado</option>
                    <option value="Murang'a">Murang'a</option>
                    <option value="Nyeri">Nyeri</option>
                    <option value="Kirinyaga">Kirinyaga</option>
                    <option value="Nyandarua">Nyandarua</option>
                    <option value="Laikipia">Laikipia</option>
                    <option value="Meru">Meru</option>
                    <option value="Tharaka Nithi">Tharaka Nithi</option>
                    <option value="Embu">Embu</option>
                    <option value="Kitui">Kitui</option>
                    <option value="Makueni">Makueni</option>
                    <option value="Uasin Gishu">Uasin Gishu</option>
                    <option value="Trans Nzoia">Trans Nzoia</option>
                    <option value="Nandi">Nandi</option>
                    <option value="Baringo">Baringo</option>
                    <option value="Kericho">Kericho</option>
                    <option value="Bomet">Bomet</option>
                    <option value="Kakamega">Kakamega</option>
                    <option value="Vihiga">Vihiga</option>
                    <option value="Bungoma">Bungoma</option>
                    <option value="Busia">Busia</option>
                    <option value="Siaya">Siaya</option>
                    <option value="Kisii">Kisii</option>
                    <option value="Nyamira">Nyamira</option>
                    <option value="Migori">Migori</option>
                    <option value="Homa Bay">Homa Bay</option>
                    <option value="Turkana">Turkana</option>
                    <option value="West Pokot">West Pokot</option>
                    <option value="Samburu">Samburu</option>
                    <option value="Trans Mara">Trans Mara</option>
                    <option value="Kwale">Kwale</option>
                    <option value="Kilifi">Kilifi</option>
                    <option value="Tana River">Tana River</option>
                    <option value="Lamu">Lamu</option>
                    <option value="Taita Taveta">Taita Taveta</option>
                    <option value="Garissa">Garissa</option>
                    <option value="Wajir">Wajir</option>
                    <option value="Mandera">Mandera</option>
                    <option value="Marsabit">Marsabit</option>
                    <option value="Isiolo">Isiolo</option>
                    <option value="Mwingi">Mwingi</option>
                    <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price Range (KSH)</label>
                  <input 
                    type="number" 
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleInputChange}
                    placeholder="5000000" 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Property Images ({formData.imageUrls?.length || 0}/5)</label>
                <ImageUpload onUploadSuccess={(url) => {
                  if ((formData.imageUrls?.length || 0) < 5) {
                    setFormData(prev => ({
                      ...prev,
                      imageUrls: [...(prev.imageUrls || []), url]
                    }));
                  }
                }} />
                {(formData.imageUrls?.length || 0) > 0 && (
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                    {(formData.imageUrls || []).map((url, i) => (
                      <div key={i} style={{position: 'relative'}}>
                        
                        <button type="button" onClick={() => setFormData(prev => ({...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i)}))} style={{position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'}}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    placeholder="12.5" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Repayment Period (years)</label>
                  <select 
                    name="repayment_period"
                    value={formData.repayment_period}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Bedrooms</label>
                  <select 
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Down Payment (%)</label>
                  <input 
                    type="number" 
                    name="down_payment"
                    value={formData.down_payment}
                    onChange={handleInputChange}
                    placeholder="20" 
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Property Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the property features, amenities, and location benefits..."
                  rows="4"
                  style={{resize: 'vertical', minHeight: '100px'}}
                />
              </div>
              <div className="form-group">
                <label>Minimum Income (KSH)</label>
                <input 
                  type="number" 
                  name="minimum_income"
                  value={formData.minimum_income}
                  onChange={handleInputChange}
                  placeholder="500000" 
                  required
                />
              </div>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? (editingListing ? 'Updating...' : 'Creating...') : (editingListing ? 'Update Listing' : 'Create Listing')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseForm} style={{marginLeft: '1rem'}}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;