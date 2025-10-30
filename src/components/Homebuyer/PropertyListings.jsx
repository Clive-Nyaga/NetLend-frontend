import { useState, useEffect } from 'react';
import api from '../../services/api';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    county: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    maxDownPayment: '',
    minMonthlyPayment: '',
    maxMonthlyPayment: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [applicationData, setApplicationData] = useState({
    loanAmount: '',
    monthlyIncome: '',
    employmentStatus: 'employed'
  });
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [existingApplications, setExistingApplications] = useState([]);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];
  const propertyTypes = ['apartment', 'bungalow', 'villa', 'townhouse', 'house', 'flat'];

  const calculateMonthlyPayment = (price, rate, term, downPaymentPercent = 0.2) => {
    const downPayment = price * downPaymentPercent;
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    if (monthlyRate === 0) {
      return loanAmount / numPayments;
    }
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return monthlyPayment;
  };

  useEffect(() => {
    loadProperties();
    loadExistingApplications();
  }, []);

  const loadExistingApplications = async () => {
    try {
      const apps = await api.getBuyerApplications();
      setExistingApplications(apps);
    } catch (error) {
      console.error('Failed to load existing applications:', error);
    }
  };

  const hasAppliedForProperty = (propertyId) => {
    return existingApplications.some(app => app.property_id === propertyId);
  };

  const loadProperties = async () => {
    try {
      const response = await api.getProperties();
      const propertiesArray = Array.isArray(response) ? response : [];
      const availableProperties = propertiesArray.filter(property => {
        const status = property.status?.toLowerCase();
        return status === 'active' || !property.status;
      });
      setProperties(availableProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
      // Use fallback to getAllMortgages if homebuyer endpoint not available
      try {
        const fallbackResponse = await api.getAllMortgages();
        const fallbackArray = Array.isArray(fallbackResponse) ? fallbackResponse : [];
        const availableProperties = fallbackArray.filter(property => {
          const status = property.status?.toLowerCase();
          return status === 'active' || !property.status;
        });
        setProperties(availableProperties);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setProperties([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const price = property.price || 0;
    const location = property.location || '';
    const propertyType = property.type || '';
    const monthlyPayment = calculateMonthlyPayment(property.price, property.rate, property.term);
    
    return (
      (!filters.county || location.toLowerCase().includes(filters.county.toLowerCase())) &&
      (!filters.propertyType || propertyType.toLowerCase().includes(filters.propertyType.toLowerCase())) &&
      (!filters.minPrice || price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || price <= parseInt(filters.maxPrice)) &&
      (!filters.bedrooms || (property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms))) &&
      (!filters.maxDownPayment || (price * 0.2) <= parseInt(filters.maxDownPayment)) &&
      (!filters.minMonthlyPayment || monthlyPayment >= parseInt(filters.minMonthlyPayment)) &&
      (!filters.maxMonthlyPayment || monthlyPayment <= parseInt(filters.maxMonthlyPayment))
    );
  });

  const handleApply = async (property) => {
    console.log('Selected property data:', property);
    setSelectedProperty(property);
    setLoadingProfile(true);
    
    try {
      const profile = await api.getBuyerProfile();
      setUserProfile(profile);
      setApplicationData({
        loanAmount: property.price * 0.8,
        monthlyIncome: profile.monthlyNetIncome || profile.monthlyGrossIncome || '',
        employmentStatus: profile.employmentStatus || 'employed'
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setUserProfile(null);
      setApplicationData({
        loanAmount: property.price * 0.8,
        monthlyIncome: '',
        employmentStatus: 'employed'
      });
    } finally {
      setLoadingProfile(false);
      setShowModal(true);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.monthlyIncome) {
      alert('Please enter your monthly income');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.submitMortgageApplication({
        property_id: selectedProperty.id,
        loan_amount: applicationData.loanAmount,
        monthly_income: applicationData.monthlyIncome,
        employment_status: applicationData.employmentStatus,
        // Include house data from mortgage_listings table
        property_location: selectedProperty.location,
        property_type: selectedProperty.type,
        property_price: selectedProperty.price,
        bedrooms: selectedProperty.bedrooms,
        interest_rate: selectedProperty.rate,
        repayment_period: selectedProperty.term,
        lender_name: selectedProperty.lender
      });
      alert('Application submitted successfully!');
      setShowModal(false);
      loadExistingApplications(); // Refresh applications list
    } catch (error) {
      alert('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <h2>Available Properties</h2>
      
      <div className="filters-section">
        <div className="filters-grid">
          <select value={filters.county} onChange={(e) => setFilters({...filters, county: e.target.value})}>
            <option value="">All Counties</option>
            {counties.map(county => <option key={county} value={county}>{county}</option>)}
          </select>
          
          <select value={filters.propertyType} onChange={(e) => setFilters({...filters, propertyType: e.target.value})}>
            <option value="">All Types</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          
          <input
            type="number"
            placeholder="Min Price (KSH)"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Max Price (KSH)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
          
          <select value={filters.bedrooms} onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}>
            <option value="">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          
          <input
            type="number"
            placeholder="Max Down Payment (KSH)"
            value={filters.maxDownPayment}
            onChange={(e) => setFilters({...filters, maxDownPayment: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Min Monthly Payment (KSH)"
            value={filters.minMonthlyPayment}
            onChange={(e) => setFilters({...filters, minMonthlyPayment: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Max Monthly Payment (KSH)"
            value={filters.maxMonthlyPayment}
            onChange={(e) => setFilters({...filters, maxMonthlyPayment: e.target.value})}
          />
        </div>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setFilters({county: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', maxDownPayment: '', minMonthlyPayment: '', maxMonthlyPayment: ''})}
        >
          Clear Filters
        </button>
      </div>

      <div className="properties-results">
        <p>Showing {filteredProperties.length} of {properties.length} properties</p>
      </div>

      {loading ? (
        <div className="loading-properties">Loading properties...</div>
      ) : (
        <>
          <div className="properties-grid">
            {(showAll ? filteredProperties : filteredProperties.slice(0, 3)).map((property, index) => (
              <div key={index} className="property-card">
                <img 
                  src={property.images && property.images[0] ? property.images[0] : `https://images.unsplash.com/photo-${1564013799919 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} 
                  alt={property.title} 
                />
                <div className="property-info">
                  <h3>{property.title || property.subject || 'Property Listing'}</h3>
                  <div className="price">KSH {property.price?.toLocaleString()}</div>
                  {property.description && (
                    <p className="property-description">{property.description.length > 100 ? property.description.substring(0, 100) + '...' : property.description}</p>
                  )}
                  <p><strong>📍</strong> {property.location}</p>
                  <p><strong>🏦</strong> Lender: {property.lender}</p>
                  <p><strong>🏠</strong> Type: {property.type}</p>
                  <p><strong>🛏️</strong> Bedrooms: {property.bedrooms}</p>
                  <p><strong>📊</strong> Interest Rate: {property.rate}% per annum</p>
                  <p><strong>⏰</strong> Repayment: {property.term} years</p>
                  <p><strong>💳</strong> Monthly Payment: KSH {calculateMonthlyPayment(property.price, property.rate, property.term).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                  {hasAppliedForProperty(property.id) ? (
                    <button className="btn btn-primary" disabled>
                      Already Applied
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleApply(property)}>
                      Apply for Mortgage
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!showAll && filteredProperties.length > 0 && (
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
              <button className="btn btn-secondary" onClick={() => setShowAll(true)}>
                View More ({filteredProperties.length - 3} more)
              </button>
            </div>
          )}
        </>
      )}

      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Mortgage</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {loadingProfile ? (
                <p>Loading your profile...</p>
              ) : (
                <>
                  <h4>Confirm Mortgage Application</h4>
                  
                  <div className="application-summary">
                    <h5>Property Details</h5>
                    <p><strong>Property:</strong> {selectedProperty.title || selectedProperty.subject || 'Property Listing'}</p>
                    <p><strong>Price:</strong> KSH {selectedProperty.price?.toLocaleString()}</p>
                    <p><strong>Location:</strong> {selectedProperty.location}</p>
                    <p><strong>Lender:</strong> {selectedProperty.lender}</p>
                    <p><strong>Property Type:</strong> {selectedProperty.type}</p>
                    <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                    <p><strong>Interest Rate:</strong> {selectedProperty.rate}% per annum</p>
                    <p><strong>Repayment Period:</strong> {selectedProperty.term} years</p>
                    <p><strong>Monthly Payment:</strong> KSH {calculateMonthlyPayment(selectedProperty.price, selectedProperty.rate, selectedProperty.term).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                  </div>
                  
                  <div className="applicant-summary">
                    <h5>Your Application Details</h5>
                    <p><strong>Loan Amount:</strong> KSH {applicationData.loanAmount?.toLocaleString()}</p>
                    <p><strong>Your Monthly Income:</strong> KSH {applicationData.monthlyIncome?.toLocaleString()}</p>
                    <p><strong>Employment Status:</strong> {applicationData.employmentStatus}</p>
                    {userProfile && (
                      <>
                        <p><strong>Full Name:</strong> {userProfile.fullName || userProfile.full_name || 'Not provided'}</p>
                        <p><strong>Email:</strong> {userProfile.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {userProfile.mpesaNumber || userProfile.phone || 'Not provided'}</p>
                      </>
                    )}
                  </div>
                  
                  {!userProfile && (
                    <div className="profile-warning">
                      <p style={{color: '#f59e0b'}}>⚠️ Complete your profile to auto-fill application details</p>
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={handleSubmitApplication}
                      disabled={submitting || !applicationData.monthlyIncome}
                    >
                      {submitting ? 'Submitting...' : 'Confirm Application'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;