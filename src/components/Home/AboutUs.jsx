const AboutUs = ({ onShowRegister, onShowContact }) => {
  const values = [
    { icon: '🛡️', title: 'Trust & Transparency', description: 'We believe in complete transparency. All our lenders are CBK-licensed and our processes are clear and straightforward.' },
    { icon: '👥', title: 'Customer First', description: 'Your success is our success. We\'re committed to helping you find the best mortgage solution for your unique needs.' },
    { icon: '🏆', title: 'Excellence', description: 'We strive for excellence in everything we do, from our technology to our customer service.' }
  ];

  const milestones = [
    { year: '2020', event: 'NetLend Founded', description: 'Started with a vision to digitize mortgage access in Kenya' },
    { year: '2021', event: 'First 1,000 Users', description: 'Reached our first milestone of happy customers' },
    { year: '2022', event: 'CBK Approval', description: 'Received official licensing from Central Bank of Kenya' },
    { year: '2023', event: '10 Partner Lenders', description: 'Expanded our network to 10 major financial institutions' },
    { year: '2024', event: 'KES 5B Facilitated', description: 'Helped facilitate over KES 5 billion in mortgages' },
    { year: '2025', event: 'Regional Expansion', description: 'Expanding services across East Africa' }
  ];

  const team = [
    { name: 'Clive Nyaga', role: 'CEO & Co-Founder', bio: '15+ years in fintech and banking sector', initials: 'CN' },
    { name: 'Aaaqil West', role: 'CTO', bio: 'Former lead engineer at major tech company', initials: 'AW' },
    { name: 'Jaynne Wangeci', role: 'Head of Customer Success', bio: 'Passionate about exceptional customer experience', initials: 'JW' }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="container">
          <h1>About NetLend</h1>
          <p>We're on a mission to make mortgage access simple, transparent, and affordable for every Kenyan.</p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="about-section-white">
        <div className="container">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>NetLend was born from a simple observation: getting a mortgage in Kenya was unnecessarily complex and time-consuming. Borrowers had to visit multiple banks, fill out endless paperwork, and wait weeks for responses.</p>
            <p>We set out to change that. By bringing together Kenya's leading lenders on one digital platform, we've made it possible to compare, apply, and manage mortgages entirely online – saving our customers time, money, and stress.</p>
            <p>Today, we're proud to have helped over 10,000 Kenyans find their perfect mortgage, facilitating over KES 5 billion in home financing.</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="about-section-gray">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To democratize access to mortgage financing in Kenya by providing a transparent, secure, and user-friendly digital platform that connects borrowers with the best lending opportunities while ensuring full regulatory compliance.</p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To be East Africa's leading digital mortgage platform, empowering millions of families to achieve homeownership through innovative technology and exceptional service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="about-section-white">
        <div className="container">
          <h2>Our Core Values</h2>
          <p className="section-subtitle">These principles guide everything we do</p>
          <div className="values-grid">
            {values.map((value, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="about-section-gray">
        <div className="container">
          <h2>Our Journey</h2>
          <p className="section-subtitle">Key milestones in our growth</p>
          <div className="timeline-grid">
            {milestones.map((milestone, i) => (
              <div key={i} className="timeline-card">
                <div className="timeline-year">{milestone.year}</div>
                <h3>{milestone.event}</h3>
                <p>{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="about-section-white">
        <div className="container">
          <h2>What We Do</h2>
          <div className="what-we-do-grid">
            <div className="wwd-card">
              <div className="wwd-icon">🏠</div>
              <h3>For Borrowers</h3>
              <ul className="wwd-list">
                <li>✓ Compare mortgage offers from multiple lenders</li>
                <li>✓ Calculate loan eligibility and repayment plans</li>
                <li>✓ Apply for loans directly through our platform</li>
                <li>✓ Manage active mortgages and track repayments</li>
              </ul>
            </div>
            <div className="wwd-card">
              <div className="wwd-icon">🏦</div>
              <h3>For Lenders</h3>
              <ul className="wwd-list">
                <li>✓ List and manage mortgage products</li>
                <li>✓ Access qualified borrower applications</li>
                <li>✓ Track loan performance and generate insights</li>
                <li>✓ Expand market reach through our platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Our Commitment */}
      <div className="about-section-gray">
        <div className="container">
          <h2>Our Commitment</h2>
          <div className="commitment-grid">
            <div className="commitment-card">
              <div className="commitment-icon">⚖️</div>
              <h3>Regulatory Compliance</h3>
              <p>We operate in full compliance with Kenya's Data Protection Act (2019), Central Bank of Kenya (CBK) guidelines, and Consumer Protection laws.</p>
            </div>
            <div className="commitment-card">
              <div className="commitment-icon">🔒</div>
              <h3>Data Security</h3>
              <p>Your personal and financial information is protected with bank-level security measures and never shared with unauthorized parties.</p>
            </div>
            <div className="commitment-card">
              <div className="commitment-icon">📊</div>
              <h3>Transparency</h3>
              <p>We ensure all mortgage terms, interest rates, and fees are clearly disclosed upfront with no hidden charges.</p>
            </div>
            <div className="commitment-card">
              <div className="commitment-icon">🤝</div>
              <h3>Fair Lending</h3>
              <p>We promote ethical lending practices and work only with licensed, verified financial institutions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose NetLend */}
      <div className="about-section-white">
        <div className="container">
          <h2>Why Choose NetLend?</h2>
          <div className="why-choose-grid">
            <div className="why-card">
              <div className="why-icon">✅</div>
              <h3>Verified Lenders</h3>
              <p>All our partner lenders are licensed and comply with CBK and SACCO regulatory frameworks.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🔐</div>
              <h3>Secure Platform</h3>
              <p>Advanced security measures protect your data and transactions.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🎯</div>
              <h3>No Direct Lending</h3>
              <p>We facilitate connections; we don't lend money, ensuring neutrality and transparency.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">📞</div>
              <h3>Comprehensive Support</h3>
              <p>From application to repayment, we provide ongoing support throughout your mortgage journey.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact */}
      <div className="about-section-gray">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-number">KSH 2.5B+</div>
              <p>Total mortgage value facilitated</p>
            </div>
            <div className="impact-card">
              <div className="impact-number">500+</div>
              <p>Families helped achieve homeownership</p>
            </div>
            <div className="impact-card">
              <div className="impact-number">50+</div>
              <p>Verified lending institutions</p>
            </div>
            <div className="impact-card">
              <div className="impact-number">47</div>
              <p>Counties - Nationwide coverage across Kenya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="about-section-white">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="section-subtitle">Led by industry experts passionate about transforming mortgage access</p>
          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="compliance-section">
        <div className="container">
          <h2>Regulatory Compliance</h2>
          <p className="section-subtitle">Your security and privacy are our top priorities</p>
          <div className="compliance-grid">
            <div className="compliance-item">
              <div className="compliance-icon">🛡️</div>
              <h3>CBK Licensed</h3>
              <p>Fully licensed by the Central Bank of Kenya</p>
            </div>
            <div className="compliance-item">
              <div className="compliance-icon">🏆</div>
              <h3>Data Protection Act 2019</h3>
              <p>Compliant with Kenya's data protection laws</p>
            </div>
            <div className="compliance-item">
              <div className="compliance-icon">🔒</div>
              <h3>Bank-Level Security</h3>
              <p>256-bit SSL encryption for all transactions</p>
            </div>
            <div className="compliance-item">
              <div className="compliance-icon">📈</div>
              <h3>Regular Audits</h3>
              <p>Independent security and compliance audits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          {/* CTA Section */}
          <div className="about-cta">
            <h3>Get Started Today</h3>
            <p>Whether you're a first-time homebuyer or a financial institution looking to expand your reach, NetLend provides the tools and connections you need. Join thousands of Kenyans who trust NetLend for their mortgage needs.</p>
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
