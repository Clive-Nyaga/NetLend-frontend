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

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: 'How long does the mortgage approval process take?', answer: 'The typical approval process takes 48-72 hours after all required documents are submitted. Complex applications may take up to 7 business days.' },
    { question: 'What documents do I need to apply?', answer: 'You\'ll need: National ID/Passport, proof of income (payslips or tax returns), bank statements for the last 6 months, and property valuation report.' },
    { question: 'What is the minimum down payment required?', answer: 'Most lenders require a minimum of 10-20% down payment, though this varies by lender and property type. Check with individual lenders for specific requirements.' },
    { question: 'Can I compare multiple lenders at once?', answer: 'Yes! That\'s the main benefit of NetLend. You can compare offers from all our partner lenders side-by-side and choose the best option for you.' },
    { question: 'Is my personal information secure?', answer: 'Absolutely. We use bank-level 256-bit encryption and are fully compliant with Kenya\'s Data Protection Act 2019. Your data is never shared without your consent.' },
    { question: 'What if my application is rejected?', answer: 'If one lender rejects your application, you can still apply with other lenders on our platform. Our team can also help you understand why and improve your application.' }
  ];

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
      {/* Header */}
      <div className="contact-hero">
        <div className="container">
          <h1>Contact & Support</h1>
          <p>We're here to help you with any questions or concerns</p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">📞</div>
              <h3>Phone</h3>
              <p>+254 700 123 456</p>
              <p className="contact-info-sub">Mon-Fri, 8AM-6PM EAT</p>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">📧</div>
              <h3>Email</h3>
              <p>info@netlend.co.ke</p>
              <p className="contact-info-sub">Response within 24 hours</p>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">📍</div>
              <h3>Office</h3>
              <p>Westlands, Nairobi</p>
              <p className="contact-info-sub">Kenya</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">

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

        {/* Business Hours & Map */}
        <div className="contact-extras">
          <div className="business-hours-card">
            <h3>⏰ Business Hours</h3>
            <div className="hours-list">
              <div className="hours-item">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM EAT</span>
              </div>
              <div className="hours-item">
                <span>Saturday</span>
                <span>9:00 AM - 1:00 PM EAT</span>
              </div>
              <div className="hours-item closed">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
          <div className="map-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8177449!2d36.8062!3d-1.2674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a6bf7445dc1%3A0x940b62a3c8efde4c!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
              width="100%"
              height="100%"
              style={{border: 0, borderRadius: 'var(--radius-lg)'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NetLend Office Location - Westlands, Nairobi"
            ></iframe>
          </div>
        </div>

        {/* Live Chat CTA */}
        <div className="live-chat-cta">
          <div className="chat-icon">💬</div>
          <h3>Need Immediate Help?</h3>
          <p>Chat with us live for instant support</p>
          <button className="btn btn-secondary">Start Live Chat</button>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;