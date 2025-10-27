const AboutUs = ({ onShowRegister, onShowContact }) => {
  return (
    <div className="about-page-wrapper">
      {/* About Hero Section */}
      <div className="about-hero">
        <div className="about-hero-background">
          
          <div className="about-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="about-hero-content">
            <h1>Transforming Mortgage Access in Kenya</h1>
            <p>We're building the future of homeownership by connecting dreams with opportunities, one mortgage at a time.</p>
            <div className="hero-badges">
              <div className="hero-badge">
                <span className="badge-icon">🏆</span>
                <span>CBK Compliant</span>
              </div>
              <div className="hero-badge">
                <span className="badge-icon">🔒</span>
                <span>Bank-Level Security</span>
              </div>
              <div className="hero-badge">
                <span className="badge-icon">🇰🇪</span>
                <span>Made in Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          {/* Vision & Mission Cards */}
          <div className="vision-mission">
            <div className="vm-card">
              <div className="vm-icon">
                
              </div>
              <h3>🏠 Who We Are</h3>
              <p>
                NetLend is Kenya's premier web-based mortgage facilitation platform that bridges the gap between borrowers seeking mortgage loans and licensed financial institutions offering mortgage products. We connect homebuyers with banks, SACCOs, and approved private lending institutions to make homeownership accessible and transparent.
              </p>
            </div>

            <div className="vm-card">
              <div className="vm-icon">
                
              </div>
              <h3>🎯 Our Mission</h3>
              <p>
                To democratize access to mortgage financing in Kenya by providing a transparent, secure, and efficient platform that connects borrowers with the best lending options available in the market.
              </p>
            </div>
          </div>

          <div className="about-section">
            <h3>What We Do</h3>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  
                </div>
                <h4>🏠 For Borrowers</h4>
                <ul>
                  <li>✓ Compare mortgage offers from multiple lenders</li>
                  <li>✓ Calculate loan eligibility and repayment plans</li>
                  <li>✓ Apply for loans directly through our platform</li>
                  <li>✓ Manage active mortgages and track repayments</li>
                </ul>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  
                </div>
                <h4>🏦 For Lenders</h4>
                <ul>
                  <li>✓ List and manage mortgage products</li>
                  <li>✓ Access qualified borrower applications</li>
                  <li>✓ Track loan performance and generate insights</li>
                  <li>✓ Expand market reach through our platform</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Our Commitment</h3>
            <div className="commitment-grid">
              <div className="commitment-item">
                <div className="commitment-icon">
                  
                </div>
                <h4>⚖️ Regulatory Compliance</h4>
                <p>We operate in full compliance with Kenya's Data Protection Act (2019), Central Bank of Kenya (CBK) guidelines, and Consumer Protection laws.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">
                  
                </div>
                <h4>🔒 Data Security</h4>
                <p>Your personal and financial information is protected with bank-level security measures and never shared with unauthorized parties.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">
                  
                </div>
                <h4>📊 Transparency</h4>
                <p>We ensure all mortgage terms, interest rates, and fees are clearly disclosed upfront with no hidden charges.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">
                  
                </div>
                <h4>🤝 Fair Lending</h4>
                <p>We promote ethical lending practices and work only with licensed, verified financial institutions.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Why Choose NetLend?</h3>
            <div className="why-choose-grid">
              <div className="why-choose-item">
                <div className="why-choose-icon">
                  
                </div>
                <h4>✅ Verified Lenders</h4>
                <p>All our partner lenders are licensed and comply with CBK and SACCO regulatory frameworks.</p>
              </div>
              <div className="why-choose-item">
                <div className="why-choose-icon">
                  
                </div>
                <h4>🔐 Secure Platform</h4>
                <p>Advanced security measures protect your data and transactions.</p>
              </div>
              <div className="why-choose-item">
                <div className="why-choose-icon">
                  
                </div>
                <h4>🎯 No Direct Lending</h4>
                <p>We facilitate connections; we don't lend money, ensuring neutrality and transparency.</p>
              </div>
              <div className="why-choose-item">
                <div className="why-choose-icon">
                  
                </div>
                <h4>📞 Comprehensive Support</h4>
                <p>From application to repayment, we provide ongoing support throughout your mortgage journey.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Our Impact</h3>
            <div className="impact-stats">
              <div className="impact-item">
                <h4>KSH 2.5 Billion+</h4>
                <p>Total mortgage value facilitated</p>
              </div>
              <div className="impact-item">
                <h4>500+ Families</h4>
                <p>Helped achieve homeownership</p>
              </div>
              <div className="impact-item">
                <h4>50+ Partners</h4>
                <p>Verified lending institutions</p>
              </div>
              <div className="impact-item">
                <h4>47 Counties</h4>
                <p>Nationwide coverage across Kenya</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Leadership Team</h3>
            <div className="team-grid">
              <div className="team-member">
                <div className="team-photo">
                  
                </div>
                <h4>Sarah Wanjiku</h4>
                <p><strong>CEO & Founder</strong></p>
                <p>15+ years in Kenyan banking sector, former CBK regulatory specialist</p>
              </div>
              <div className="team-member">
                <div className="team-photo">
                  
                </div>
                <h4>David Kimani</h4>
                <p><strong>CTO</strong></p>
                <p>Fintech expert with experience in secure payment systems and data protection</p>
              </div>
              <div className="team-member">
                <div className="team-photo">
                  
                </div>
                <h4>Grace Achieng</h4>
                <p><strong>Head of Partnerships</strong></p>
                <p>Former SACCO executive with deep knowledge of Kenya's lending landscape</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Get Started Today</h3>
            <p>
              Whether you're a first-time homebuyer or a financial institution looking to expand your reach, NetLend provides the tools and connections you need. Join thousands of Kenyans who trust NetLend for their mortgage needs.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={onShowRegister}>Start Your Application</button>
              <button className="btn btn-secondary" onClick={onShowContact}>Partner With Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
