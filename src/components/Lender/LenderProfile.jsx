import { useState, useEffect } from 'react';
import ImageUpload from '../ImageUpload';
import api from '../../services/api';

const LenderProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    company_name: '',
    license_number: '',
    contact_email: '',
    phone: '',
    address: '',
    description: '',
    logo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await api.getLenderProfile();
      setProfileData({
        company_name: profile.institution_name || user?.institution_name || '',
        license_number: profile.business_registration_number || '',
        contact_email: profile.email || user?.email || '',
        phone: profile.phone_number || '',
        address: profile.address || '',
        description: profile.description || '',
        logo: profile.logo || ''
      });
    } catch (error) {
      console.log('Backend endpoint not ready, using user data:', error.message);
      if (user) {
        setProfileData({
          company_name: user.institution_name || '',
          license_number: '',
          contact_email: user.email || '',
          phone: '',
          address: '',
          description: '',
          logo: ''
        });
      }
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updateData = {
      institution_name: profileData.company_name,
      business_registration_number: profileData.license_number,
      email: profileData.contact_email,
      phone_number: profileData.phone,
      address: profileData.address,
      description: profileData.description,
      logo: profileData.logo
    };
    
    console.log('Sending profile update data:', updateData);
    
    try {
      const response = await api.updateLenderProfile(updateData);
      console.log('Profile update response:', response);
      alert('Profile updated successfully!');
      // Reload profile to verify changes
      await loadProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        alert('Backend endpoints not ready yet. Profile form works but data is not saved.');
      } else {
        alert('Failed to update profile: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Lender Profile</h2>
      
      <div className="profile-info">
        <p><strong>Lender ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>Institution Name:</strong> {user?.institution_name || 'N/A'}</p>
        <p><strong>Contact Person:</strong> {user?.contact_person || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Logo</label>
          <ImageUpload onUploadSuccess={(url) => setProfileData({...profileData, logo: url})} />
        </div>
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
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default LenderProfile;