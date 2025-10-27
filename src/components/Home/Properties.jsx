import { useState, useEffect } from 'react';
import api from '../../services/api';

const Properties = ({ onShowRegister, onShowLogin, onShowContact }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

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
              <button className="btn btn-primary" onClick={onShowRegister}>Get Notified</button>
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
                    <button className="btn btn-primary property-btn" onClick={() => {
                      setSelectedProperty(property);
                      setShowPropertyModal(true);
                    }}>View Details</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lender Partnership Section */}
      <div className="lender-section">
        <div className="container">
          <div className="lender-content">
            <div className="lender-info">
              <h2>Partner With NetLend</h2>
              <p className="lender-subtitle">
                Join Kenya's leading mortgage platform and expand your reach to qualified borrowers across all 47 counties.
              </p>
              
              <div className="lender-benefits">
                <div className="lender-benefit">
                  <div className="lender-benefit-icon">📈</div>
                  <div>
                    <h4>Increase Loan Volume</h4>
                    <p>Access a steady stream of pre-qualified mortgage applications</p>
                  </div>
                </div>
                <div className="lender-benefit">
                  <div className="lender-benefit-icon">🎯</div>
                  <div>
                    <h4>Targeted Marketing</h4>
                    <p>Reach borrowers actively seeking mortgage products in your target segments</p>
                  </div>
                </div>
                <div className="lender-benefit">
                  <div className="lender-benefit-icon">⚡</div>
                  <div>
                    <h4>Faster Processing</h4>
                    <p>Streamlined application process reduces time-to-approval by 40%</p>
                  </div>
                </div>
                <div className="lender-benefit">
                  <div className="lender-benefit-icon">📊</div>
                  <div>
                    <h4>Analytics & Insights</h4>
                    <p>Comprehensive reporting and market intelligence to optimize your offerings</p>
                  </div>
                </div>
              </div>
              
              <div className="lender-cta">
                <button className="btn btn-primary lender-btn" onClick={onShowContact}>Become a Partner</button>
                <button className="btn btn-secondary lender-btn" onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/partnership-guide.pdf';
                  link.download = 'NetLend-Partnership-Guide.pdf';
                  link.click();
                }}>Download Partnership Guide</button>
              </div>
            </div>
            
            <div className="lender-image">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Lender Partnership" />
            </div>
          </div>
        </div>
      </div>

      {/* Lender Success Stories */}
      <div className="success-stories">
        <div className="container">
          <h2>Success Stories from Our Partners</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-image">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Bank Partner" />
              </div>
              <div className="story-content">
                <h3>Kenya Commercial Bank</h3>
                <p>"NetLend helped us increase our mortgage portfolio by 65% in just 12 months. The quality of applications and streamlined process has been exceptional."</p>
                <div className="story-stats">
                  <span className="stat">+65% Portfolio Growth</span>
                  <span className="stat">500+ New Customers</span>
                </div>
              </div>
            </div>
            
            <div className="story-card">
              <div className="story-image">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="SACCO Partner" />
              </div>
              <div className="story-content">
                <h3>Mwalimu National SACCO</h3>
                <p>"The platform's analytics helped us optimize our interest rates and improve our approval rates by 30%. Highly recommended for any serious lender."</p>
                <div className="story-stats">
                  <span className="stat">+30% Approval Rate</span>
                  <span className="stat">200+ Active Loans</span>
                </div>
              </div>
            </div>
          </div>
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

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowPropertyModal(false)}>
          <div className="modal-content property-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProperty.title}</h2>
              <button className="close-btn" onClick={() => setShowPropertyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="property-details">
                <img src={selectedProperty.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={selectedProperty.title} className="property-detail-image" />
                <div className="property-info-detailed">
                  <div className="price-highlight">KSH {selectedProperty.price_range?.toLocaleString()}</div>
                  <div className="property-specs">
                    <p><strong>📍 Location:</strong> {selectedProperty.address}, {selectedProperty.county}</p>
                    <p><strong>🏠 Property Type:</strong> {selectedProperty.property_type}</p>
                    <p><strong>📊 Interest Rate:</strong> {selectedProperty.interest_rate}% per annum</p>
                    <p><strong>⏰ Repayment Period:</strong> {selectedProperty.repayment_period} years</p>
                    <p><strong>💰 Down Payment:</strong> {selectedProperty.down_payment || '20%'}</p>
                    <p><strong>📋 Description:</strong> {selectedProperty.description || 'Beautiful property in a prime location with modern amenities and excellent connectivity.'}</p>
                  </div>
                  <div className="property-actions">
                    <button className="btn btn-primary" onClick={() => {
                      setShowPropertyModal(false);
                      onShowLogin();
                    }}>Apply for Mortgage</button>
                    <button className="btn btn-secondary" onClick={() => {
                      setShowPropertyModal(false);
                      onShowContact();
                    }}>Contact Lender</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Properties;