import { useState, useEffect } from 'react';
import api from '../../services/api';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    county: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    maxDownPayment: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [applicationData, setApplicationData] = useState({
    loanAmount: '',
    monthlyIncome: '',
    employmentStatus: 'employed'
  });
  const [submitting, setSubmitting] = useState(false);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];
  const propertyTypes = ['apartment', 'bungalow', 'villa', 'townhouse', 'house', 'flat'];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      console.log('Loading properties for buyer dashboard...');
      const response = await api.getProperties();
      console.log('Properties response:', response);
      const propertiesArray = Array.isArray(response) ? response : [];
      if (propertiesArray.length > 0) {
        console.log('First property structure:', propertiesArray[0]);
        console.log('Property fields:', Object.keys(propertiesArray[0]));
      }
      console.log('Setting properties:', propertiesArray);
      setProperties(propertiesArray);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const price = property.price_range || property.price || 0;
    const location = property.location || property.address || '';
    const propertyType = property.property_type || property.type || '';
    
    return (
      (!filters.county || location.toLowerCase().includes(filters.county.toLowerCase())) &&
      (!filters.propertyType || propertyType.toLowerCase().includes(filters.propertyType.toLowerCase())) &&
      (!filters.minPrice || price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || price <= parseInt(filters.maxPrice)) &&
      (!filters.bedrooms || (property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms))) &&
      (!filters.maxDownPayment || (price * 0.2) <= parseInt(filters.maxDownPayment))
    );
  });

  const handleApply = (property) => {
    setSelectedProperty(property);
    setApplicationData({
      loanAmount: property.price_range * 0.8,
      monthlyIncome: '',
      employmentStatus: 'employed'
    });
    setShowModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.monthlyIncome) {
      alert('Please enter your monthly income');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.submitMortgageApplication({
        property_id: selectedProperty.id,
        loan_amount: applicationData.loanAmount,
        monthly_income: applicationData.monthlyIncome,
        employment_status: applicationData.employmentStatus
      });
      alert('Application submitted successfully!');
      setShowModal(false);
    } catch (error) {
      alert('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <h2>Available Properties</h2>
      
      <div className="filters-section">
        <div className="filters-grid">
          <select value={filters.county} onChange={(e) => setFilters({...filters, county: e.target.value})}>
            <option value="">All Counties</option>
            {counties.map(county => <option key={county} value={county}>{county}</option>)}
          </select>
          
          <select value={filters.propertyType} onChange={(e) => setFilters({...filters, propertyType: e.target.value})}>
            <option value="">All Types</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          
          <input
            type="number"
            placeholder="Min Price (KSH)"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Max Price (KSH)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
          
          <select value={filters.bedrooms} onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}>
            <option value="">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          
          <input
            type="number"
            placeholder="Max Down Payment (KSH)"
            value={filters.maxDownPayment}
            onChange={(e) => setFilters({...filters, maxDownPayment: e.target.value})}
          />
        </div>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setFilters({county: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', maxDownPayment: ''})}
        >
          Clear Filters
        </button>
      </div>

      <div className="properties-results">
        <p>Showing {filteredProperties.length} of {properties.length} properties</p>
      </div>

      {loading ? (
        <p>Loading properties...</p>
      ) : (
        <>
          <div className="properties-grid">
            {(showAll ? filteredProperties : filteredProperties.slice(0, 3)).map((property, index) => (
              <div key={index} className="property-card">
                <img 
                  src={property.images && property.images[0] ? property.images[0] : `https://images.unsplash.com/photo-${1564013799919 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} 
                  alt={property.title} 
                />
                <div className="property-info">
                  <h3>{property.title || `Property ${property.id}`}</h3>
                  <div className="price">KSH {(property.price_range || property.price)?.toLocaleString()}</div>
                  <p><strong>📍</strong> {property.address || property.location}</p>
                  <p><strong>🏦</strong> Lender: {property.lender}</p>
                  <p><strong>🏠</strong> Type: {property.property_type || property.type}</p>
                  <p><strong>🛏️</strong> Bedrooms: {property.bedrooms || 'N/A'}</p>
                  <p><strong>🚿</strong> Bathrooms: {property.bathrooms || 'N/A'}</p>
                  <p><strong>📐</strong> Size: {property.size || 'N/A'} sq ft</p>
                  <p><strong>📊</strong> Interest Rate: {property.interest_rate}% per annum</p>
                  <p><strong>⏰</strong> Repayment: {property.repayment_period} years</p>
                  <p><strong>💰</strong> Down Payment: KSH {((property.price_range || property.price) * 0.2)?.toLocaleString()}</p>
                  <button className="btn btn-primary" onClick={() => handleApply(property)}>
                    Apply for Mortgage
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!showAll && filteredProperties.length > 0 && (
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
              <button className="btn btn-secondary" onClick={() => setShowAll(true)}>
                View More ({filteredProperties.length - 3} more)
              </button>
            </div>
          )}
        </>
      )}

      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Mortgage</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h4>{selectedProperty.title || `Property ${selectedProperty.id}`}</h4>
              <p><strong>Price:</strong> KSH {(selectedProperty.price_range || selectedProperty.price)?.toLocaleString()}</p>
              <p><strong>Location:</strong> {selectedProperty.address || selectedProperty.location}</p>
              <p><strong>Lender:</strong> {selectedProperty.lender}</p>
              <p><strong>Property Type:</strong> {selectedProperty.property_type || selectedProperty.type}</p>
              <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms || 'N/A'}</p>
              <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms || 'N/A'}</p>
              <p><strong>Size:</strong> {selectedProperty.size || 'N/A'} sq ft</p>
              <p><strong>Interest Rate:</strong> {selectedProperty.interest_rate}% per annum</p>
              <p><strong>Repayment Period:</strong> {selectedProperty.repayment_period} years</p>
              
              <div className="form-group">
                <label>Loan Amount (KSH)</label>
                <input 
                  type="number" 
                  value={applicationData.loanAmount}
                  onChange={(e) => setApplicationData({...applicationData, loanAmount: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Monthly Income (KSH)</label>
                <input 
                  type="number" 
                  placeholder="Enter your monthly income"
                  value={applicationData.monthlyIncome}
                  onChange={(e) => setApplicationData({...applicationData, monthlyIncome: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Employment Status</label>
                <select 
                  value={applicationData.employmentStatus}
                  onChange={(e) => setApplicationData({...applicationData, employmentStatus: e.target.value})}
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;