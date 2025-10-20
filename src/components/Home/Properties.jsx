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
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80" alt="Modern Kenyan Home" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Your Dream Home Awaits</h1>
            <p className="hero-subtitle">
              Connect with Kenya's top mortgage lenders and find the perfect financing for your new home. 
              Compare rates, get pre-approved, and secure your future today.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">🏠</div>
                <h3>500+</h3>
                <p>Happy Homeowners</p>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏦</div>
                <h3>50+</h3>
                <p>Partner Lenders</p>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <h3>KSH 2B+</h3>
                <p>Loans Facilitated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <div className="container">
          <h2>How NetLend Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Registration" className="step-image" />
              </div>
              <div className="step-number">1</div>
              <h3>Register & Apply</h3>
              <p>Create your account and submit your mortgage application with required documents</p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Compare" className="step-image" />
              </div>
              <div className="step-number">2</div>
              <h3>Compare Offers</h3>
              <p>Receive multiple mortgage offers from our verified lender network</p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Handshake" className="step-image" />
              </div>
              <div className="step-number">3</div>
              <h3>Choose & Close</h3>
              <p>Select the best offer and complete your mortgage process with our support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container">
        <h2>Featured Mortgage Opportunities</h2>
        <div className="properties-grid">
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <div className="no-properties">
              <div className="no-properties-icon">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Coming Soon" className="coming-soon-image" />
              </div>
              <h3>Exciting Opportunities Coming Soon!</h3>
              <p>Our lender partners are preparing amazing mortgage offers for you. Register now to be the first to know when new opportunities become available.</p>
              <button className="btn btn-primary">Get Notified</button>
            </div>
          ) : (
            properties.map((property, index) => {
              const propertyImages = [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              ];
              return (
                <div key={index} className="property-card">
                  <img src={property.image || propertyImages[index % 3]} alt={property.title} />
                  <div className="property-badge">Featured</div>
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <div className="price">KSH {property.price_range?.toLocaleString()}</div>
                    <p><strong>📍 Location:</strong> {property.address}, {property.county}</p>
                    <p><strong>🏠 Type:</strong> {property.property_type}</p>
                    <p><strong>📊 Interest Rate:</strong> {property.interest_rate}% per annum</p>
                    <p><strong>⏰ Repayment:</strong> {property.repayment_period} years</p>
                    <button className="btn btn-primary property-btn">View Details</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <h2>Why Choose NetLend?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>🏦 Verified Lenders</h3>
              <p>All our partners are licensed by CBK and comply with Kenyan banking regulations</p>
            </div>
            <div className="benefit-card">
              <h3>💰 Best Rates</h3>
              <p>Compare multiple offers to find the most competitive interest rates available</p>
            </div>
            <div className="benefit-card">
              <h3>🔒 Secure Platform</h3>
              <p>Your data is protected with bank-level security and encryption</p>
            </div>
            <div className="benefit-card">
              <h3>📞 Expert Support</h3>
              <p>Get guidance from our mortgage specialists throughout your journey</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;