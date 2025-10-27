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
        <div className="hero-content">
          <h1 className="hero-title">Find the Perfect Mortgage — Quickly, Securely, and Transparently.</h1>
          <p className="hero-subtitle">
            Compare lenders, apply online, and manage your mortgage all in one place. Kenya's most trusted digital mortgage platform.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => window.location.href = '#compare'}>Compare Mortgages</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '#about'}>Learn More</button>
          </div>
          
          {/* Trust Indicators */}
          <div className="trust-items">
            <div className="trust-item">
              <div className="trust-logo">🏛️</div>
              <span className="trust-icon">✓</span>
              <span>CBK Licensed</span>
            </div>
            <div className="trust-item">
              <div className="trust-logo">🔐</div>
              <span className="trust-icon">✓</span>
              <span>Data Protection Compliant</span>
            </div>
            <div className="trust-item">
              <div className="trust-logo">🔒</div>
              <span className="trust-icon">✓</span>
              <span>256-bit Encryption</span>
            </div>
            <div className="trust-item">
              <div className="trust-logo">⭐</div>
              <span className="trust-icon">✓</span>
              <span>10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="features-section">
        <div className="container">
          <h2>Everything You Need in One Platform</h2>
          <p className="section-subtitle">Simplify your mortgage journey with our comprehensive suite of tools and services.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Mortgage Comparison</h3>
              <p>Compare mortgage offers from multiple licensed lenders in one place. Find the best rates and terms for your needs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧮</div>
              <h3>Loan Calculator</h3>
              <p>Calculate your monthly repayments, total interest, and affordability with our easy-to-use mortgage calculator.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Pre-Approval</h3>
              <p>Get pre-approved quickly and know exactly how much you can borrow before house hunting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Processing</h3>
              <p>Your data is protected with bank-level encryption. Fully compliant with CBK and Data Protection Act 2019.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">Get your dream home in 4 simple steps</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Compare Lenders</h3>
              <p>Browse and compare mortgage offers from verified lenders</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Apply Online</h3>
              <p>Complete your application in minutes with our digital process</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Get Approved</h3>
              <p>Receive approval notifications and track your application status</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Manage & Repay</h3>
              <p>Track repayments and manage your mortgage from your dashboard</p>
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
                <div className="lender-benefit-column">
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
                </div>
                <div className="lender-benefit-column">
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
              
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <p className="section-subtitle">Join thousands of satisfied homeowners</p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p>"NetLend made my mortgage journey so simple! I compared 5 different lenders and saved KES 200,000 on my home loan."</p>
              <div className="testimonial-author">
                <strong>Grace Wanjiru</strong>
                <span>Nairobi</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p>"The pre-approval process was incredibly fast. I had my documents ready and got approved within 48 hours!"</p>
              <div className="testimonial-author">
                <strong>David Omondi</strong>
                <span>Mombasa</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p>"As a first-time home buyer, I was overwhelmed. NetLend's team guided me through every step. Highly recommended!"</p>
              <div className="testimonial-author">
                <strong>Faith Njeri</strong>
                <span>Kisumu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Lenders */}
      <div className="partners-section">
        <div className="container">
          <h2>Our Trusted Lender Partners</h2>
          <p className="section-subtitle">We work with Kenya's leading financial institutions</p>
          <div className="partners-grid">
            {[
              { name: 'KCB Bank', icon: '🏦' },
              { name: 'Equity Bank', icon: '🏛️' },
              { name: 'Co-operative Bank', icon: '🤝' },
              { name: 'NCBA Bank', icon: '💼' },
              { name: 'Stanbic Bank', icon: '🏢' },
              { name: 'Absa Bank', icon: '🏪' }
            ].map((lender, i) => (
              <div key={i} className="partner-card">
                <div className="partner-logo">{lender.icon}</div>
                <div>{lender.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of Kenyans who have found their perfect mortgage through NetLend</p>
          <button className="btn btn-primary" onClick={onShowRegister}>Create Free Account</button>
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