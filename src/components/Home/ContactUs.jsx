import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'buyer'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      userType: 'buyer'
    });
  };

  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-background">
          
          <div className="contact-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="contact-hero-content">
            <h1>Get In Touch</h1>
            <p>We're here to help you navigate your mortgage journey. Reach out to our expert team for personalized assistance.</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Contact Methods */}
        <div className="contact-methods">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                
              </div>
              <h3>📞 Phone Support</h3>
              <p><strong>Main Line:</strong> +254 700 123 456</p>
              <p><strong>WhatsApp:</strong> +254 700 123 456</p>
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 2:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                
              </div>
              <h3>📧 Email Support</h3>
              <p><strong>General:</strong> info@netlend.co.ke</p>
              <p><strong>Support:</strong> support@netlend.co.ke</p>
              <p><strong>Partnerships:</strong> partners@netlend.co.ke</p>
              <p>Response time: Within 24 hours</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                
              </div>
              <h3>🏢 Office Location</h3>
              <p><strong>NetLend Kenya Ltd</strong></p>
              <p>Westlands Office Park</p>
              <p>Waiyaki Way, Westlands</p>
              <p>Nairobi, Kenya</p>
              <p>P.O. Box 12345-00100</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="contact-form-grid">
            <div className="form-info">
              <h2>Send Us a Message</h2>
              <p>Have a specific question or need personalized assistance? Fill out the form and our team will get back to you promptly.</p>
              
              <div className="form-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <div>
                    <h4>Quick Response</h4>
                    <p>We respond to all inquiries within 24 hours</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">👨‍💼</span>
                  <div>
                    <h4>Expert Guidance</h4>
                    <p>Get advice from certified mortgage specialists</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔒</span>
                  <div>
                    <h4>Secure & Confidential</h4>
                    <p>Your information is protected and never shared</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div className="form-group">
                    <label>I am a *</label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      required
                    >
                      <option value="buyer">Potential Homebuyer</option>
                      <option value="lender">Financial Institution</option>
                      <option value="agent">Real Estate Agent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What can we help you with?"
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary contact-submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h3>🏠 For Homebuyers</h3>
              <div className="faq-item">
                <h4>How do I get started?</h4>
                <p>Simply register on our platform, complete your profile, and submit your mortgage application. We'll connect you with suitable lenders.</p>
              </div>
              <div className="faq-item">
                <h4>Is NetLend free to use?</h4>
                <p>Yes! Our platform is completely free for homebuyers. We earn through partnerships with lenders.</p>
              </div>
            </div>

            <div className="faq-card">
              <h3>🏦 For Lenders</h3>
              <div className="faq-item">
                <h4>How do I become a partner?</h4>
                <p>Contact our partnerships team. We work with licensed banks, SACCOs, and approved financial institutions.</p>
              </div>
              <div className="faq-item">
                <h4>What are the requirements?</h4>
                <p>Valid CBK or SACCO license, compliance with regulations, and commitment to fair lending practices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;