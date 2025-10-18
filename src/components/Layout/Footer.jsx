const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <div className="logo-placeholder"></div>
            <h3>NetLend</h3>
          </div>
          <p>Kenya's premier mortgage facilitation platform connecting borrowers with licensed lenders.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li>Mortgage Comparison</li>
            <li>Loan Calculator</li>
            <li>Pre-Approval</li>
            <li>Lender Network</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <p>📧 info@netlend.co.ke</p>
            <p>📞 +254 700 000 000</p>
            <p>📍 Nairobi, Kenya</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-legal">
          <p>&copy; 2024 NetLend Limited. All rights reserved.</p>
          <p>Licensed and regulated by Central Bank of Kenya (CBK)</p>
        </div>
        <div className="footer-compliance">
          <p>Data Protection Act (2019) Compliant | Consumer Protection Certified</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;