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
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price Range:</strong> ${listing.price_range}</p>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" placeholder="Nairobi, Kenya" />
                </div>
                <div className="form-group">
                  <label>Price Range ($)</label>
                  <input type="number" placeholder="500000" />
                </div>
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
                  <label>Minimum Income ($)</label>
                  <input type="number" placeholder="50000" />
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