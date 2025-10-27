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

  const counties = ['Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Kisumu', 'Machakos', 'Kajiado'];
  const propertyTypes = ['apartment', 'bungalow', 'villa', 'townhouse'];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.getProperties();
      setProperties(response.properties || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    return (
      (!filters.county || property.county === filters.county) &&
      (!filters.propertyType || property.property_type === filters.propertyType) &&
      (!filters.minPrice || property.price_range >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || property.price_range <= parseInt(filters.maxPrice)) &&
      (!filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)) &&
      (!filters.maxDownPayment || (property.price_range * 0.2) <= parseInt(filters.maxDownPayment))
    );
  });

  const handleApply = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
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
        <div className="properties-grid">
          {filteredProperties.map((property, index) => (
            <div key={index} className="property-card">
                src={property.image || `https://images.unsplash.com/photo-${1564013799919 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} 
                alt={property.title} 
              />
              <div className="property-info">
                <h3>{property.title}</h3>
                <div className="price">KSH {property.price_range?.toLocaleString()}</div>
                <p><strong>📍</strong> {property.address}, {property.county}</p>
                <p><strong>🏠</strong> {property.property_type}</p>
                <p><strong>📊</strong> {property.interest_rate}% interest</p>
                <p><strong>⏰</strong> {property.repayment_period} years</p>
                <p><strong>💰</strong> Down Payment: KSH {(property.price_range * 0.2)?.toLocaleString()}</p>
                <button className="btn btn-primary" onClick={() => handleApply(property)}>
                  Apply for Mortgage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Mortgage</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h4>{selectedProperty.title}</h4>
              <p><strong>Price:</strong> KSH {selectedProperty.price_range?.toLocaleString()}</p>
              <p><strong>Location:</strong> {selectedProperty.address}, {selectedProperty.county}</p>
              <p><strong>Interest Rate:</strong> {selectedProperty.interest_rate}%</p>
              
              <div className="form-group">
                <label>Loan Amount (KSH)</label>
                <input type="number" defaultValue={selectedProperty.price_range * 0.8} />
              </div>
              
              <div className="form-group">
                <label>Monthly Income (KSH)</label>
                <input type="number" placeholder="Enter your monthly income" />
              </div>
              
              <div className="form-group">
                <label>Employment Status</label>
                <select>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-primary">Submit Application</button>
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