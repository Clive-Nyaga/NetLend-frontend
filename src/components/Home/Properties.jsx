import { useState, useEffect } from 'react';
import api from '../../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container">
      <h2>Available Properties</h2>
      <div className="properties-grid">
        {loading ? (
          <p>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p>No properties available.</p>
        ) : (
          properties.map((property, index) => (
            <div key={index} className="property-card">
              <img src={property.image || '/placeholder.jpg'} alt={property.title} />
              <div className="property-info">
                <h3>{property.title}</h3>
                <div className="price">${property.price?.toLocaleString()}</div>
                <p>{property.location}</p>
                <p>{property.bedrooms} bed, {property.bathrooms} bath</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Properties;