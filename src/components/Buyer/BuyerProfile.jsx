import { useState } from 'react';

const BuyerProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.full_name || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    income: user?.income || '',
    credit_score: user?.credit_score || '',
    employment_status: user?.employment_status || ''
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h3>My Profile</h3>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Annual Income:</label>
          <input
            type="number"
            name="income"
            value={profile.income}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Credit Score:</label>
          <input
            type="number"
            name="credit_score"
            value={profile.credit_score}
            onChange={handleChange}
            min="300"
            max="850"
          />
        </div>
        
        <div className="form-group">
          <label>Employment Status:</label>
          <select
            name="employment_status"
            value={profile.employment_status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default BuyerProfile;