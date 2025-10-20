const AboutUs = () => {
  return (
    <div className="about-page-wrapper">
      <div className="container">
        <h2>About NetLend</h2>
        <div className="about-content">
          <div className="about-section">
            <h3>Who We Are</h3>
            <p>
              NetLend is Kenya's premier web-based mortgage facilitation platform that bridges the gap between borrowers seeking mortgage loans and licensed financial institutions offering mortgage products. We connect homebuyers with banks, SACCOs, and approved private lending institutions to make homeownership accessible and transparent.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              To democratize access to mortgage financing in Kenya by providing a transparent, secure, and efficient platform that connects borrowers with the best lending options available in the market.
            </p>
          </div>

          <div className="about-section">
            <h3>What We Do</h3>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="For Borrowers" />
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
                  <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="For Lenders" />
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
                <h4>Regulatory Compliance</h4>
                <p>We operate in full compliance with Kenya's Data Protection Act (2019), Central Bank of Kenya (CBK) guidelines, and Consumer Protection laws.</p>
              </div>
              <div className="commitment-item">
                <h4>Data Security</h4>
                <p>Your personal and financial information is protected with bank-level security measures and never shared with unauthorized parties.</p>
              </div>
              <div className="commitment-item">
                <h4>Transparency</h4>
                <p>We ensure all mortgage terms, interest rates, and fees are clearly disclosed upfront with no hidden charges.</p>
              </div>
              <div className="commitment-item">
                <h4>Fair Lending</h4>
                <p>We promote ethical lending practices and work only with licensed, verified financial institutions.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Why Choose NetLend?</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <strong>Verified Lenders:</strong> All our partner lenders are licensed and comply with CBK and SACCO regulatory frameworks.
              </div>
              <div className="benefit-item">
                <strong>Secure Platform:</strong> Advanced security measures protect your data and transactions.
              </div>
              <div className="benefit-item">
                <strong>No Direct Lending:</strong> We facilitate connections; we don't lend money, ensuring neutrality and transparency.
              </div>
              <div className="benefit-item">
                <strong>Comprehensive Support:</strong> From application to repayment, we provide ongoing support throughout your mortgage journey.
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
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Sarah Wanjiku" />
                </div>
                <h4>Sarah Wanjiku</h4>
                <p><strong>CEO & Founder</strong></p>
                <p>15+ years in Kenyan banking sector, former CBK regulatory specialist</p>
              </div>
              <div className="team-member">
                <div className="team-photo">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="David Kimani" />
                </div>
                <h4>David Kimani</h4>
                <p><strong>CTO</strong></p>
                <p>Fintech expert with experience in secure payment systems and data protection</p>
              </div>
              <div className="team-member">
                <div className="team-photo">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Grace Achieng" />
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
              <button className="btn btn-primary">Start Your Application</button>
              <button className="btn btn-secondary">Partner With Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
