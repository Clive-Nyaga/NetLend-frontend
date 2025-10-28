import { useState, useEffect } from 'react';
import api from '../../services/api';
import PaymentModal from './PaymentModal';

const PropertySearch = ({ buyerId }) => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await api.getProperties();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    loadProperties();
  };

  const handleApplyLoan = (property) => {
    setSelectedProperty(property);
    setShowPaymentModal(true);
  };

  return (
    <div>
      <h3>Property Search</h3>
      
      <div className="search-filters">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="properties-grid">
        {properties.map((property, index) => (
          <div key={property.id || index} className="property-card">
            <h4>{property.title}</h4>
            <p>{property.address}, {property.county}</p>
            <p>KSh {property.price_range?.toLocaleString()}</p>
            <p>Interest Rate: {property.interest_rate}%</p>
            <button onClick={() => handleApplyLoan(property)}>Apply for Loan</button>
          </div>
        ))}
      </div>
      
      {properties.length === 0 && (
        <p>No properties found. Try adjusting your search filters.</p>
      )}
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        property={selectedProperty}
        loanDetails={{ processingFee: 5000 }}
      />
    </div>
  );
};

export default PropertySearch;