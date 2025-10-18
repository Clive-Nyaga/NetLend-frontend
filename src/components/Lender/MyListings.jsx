import { useState, useEffect } from 'react';
import api from '../../services/api';

const MyListings = ({ lenderId }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadListings();
  }, [lenderId]);

  const loadListings = async () => {
    try {
      const response = await api.getLenderListings(lenderId);
      setListings(response.listings || []);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
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
          listings.map((listing, index) => (
            <div key={index} className="listing-card">
              <h3>{listing.title}</h3>
              <p><strong>Type:</strong> {listing.property_type}</p>
              <p><strong>Address:</strong> {listing.address}</p>
              <p><strong>County:</strong> {listing.county}</p>
              <p><strong>Price Range:</strong> KSH {listing.price_range?.toLocaleString()}</p>
              <p><strong>Interest Rate:</strong> {listing.interest_rate}%</p>
              <p><strong>Repayment Period:</strong> {listing.repayment_period} years</p>
              <div className="listing-actions">
                <button className="btn">Edit</button>
                <button className="btn danger">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddForm && (
        <div className="modal show">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <span className="close" onClick={() => setShowAddForm(false)}>&times;</span>
            <h2>Add Mortgage Offer</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Property Title</label>
                  <input type="text" placeholder="Modern 3BR Apartment" />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select>
                    <option value="apartment">Apartment</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Property Address (Required)</label>
                <input type="text" placeholder="123 Main Street, Westlands" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>County (Required)</label>
                  <select required>
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
                  <input type="number" placeholder="5000000" />
                </div>
              </div>
              <div className="form-group">
                <label>Property Images (Exactly 5 Required)</label>
                <input type="file" multiple accept="image/*" required />
                <small style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Upload exactly 5 property images</small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input type="number" step="0.1" placeholder="12.5" />
                </div>
                <div className="form-group">
                  <label>Repayment Period (years)</label>
                  <select>
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Income (KSH)</label>
                  <input type="number" placeholder="500000" />
                </div>
                <div className="form-group">
                  <label>Down Payment (%)</label>
                  <input type="number" placeholder="20" />
                </div>
              </div>
              <button type="submit" className="btn">Create Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;