import { useState } from 'react';

const LenderProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    company_name: user?.company_name || '',
    license_number: user?.license_number || '',
    contact_email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    description: user?.description || ''
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update profile logic
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="section">
      <h2>Lender Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              name="company_name"
              value={profileData.company_name}
              onChange={handleChange}
              placeholder="ABC Bank Ltd"
            />
          </div>
          <div className="form-group">
            <label>License Number</label>
            <input 
              type="text" 
              name="license_number"
              value={profileData.license_number}
              onChange={handleChange}
              placeholder="CBK/LIC/2024/001"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Contact Email</label>
            <input 
              type="email" 
              name="contact_email"
              value={profileData.contact_email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              placeholder="+254 700 000 000"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Business Address</label>
          <input 
            type="text" 
            name="address"
            value={profileData.address}
            onChange={handleChange}
            placeholder="123 Business Street, Nairobi"
          />
        </div>
        
        <div className="form-group">
          <label>Company Description</label>
          <textarea 
            name="description"
            value={profileData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Brief description of your lending services..."
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid var(--border-color)',
              borderRadius: '12px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button type="submit" className="btn">Update Profile</button>
      </form>
    </div>
  );
};

export default LenderProfile;