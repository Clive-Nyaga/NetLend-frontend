import { useState, useEffect } from 'react';
import api from '../../services/api';

const BuyerProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creditScore, setCreditScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [documents, setDocuments] = useState({
    nationalId: null,
    kraPin: null,
    bankStatement: null,
    proofOfIncome: null
  });
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    county: '',
    maritalStatus: '',
    dependents: '',
    
    // Employment & Income
    employmentStatus: '',
    employerName: '',
    occupation: '',
    employmentDuration: '',
    monthlyGrossIncome: '',
    monthlyNetIncome: '',
    otherIncome: '',
    
    // Financial Obligations
    existingLoans: false,
    loanTypes: '',
    monthlyLoanRepayments: '',
    monthlyExpenses: '',
    
    // Property Preferences
    preferredPropertyType: '',
    targetCounty: '',
    estimatedPropertyValue: '',
    desiredLoanAmount: '',
    repaymentPeriod: '',
    downPaymentAmount: '',
    
    // Banking Information
    bankName: '',
    accountNumber: '',
    mpesaNumber: ''
  });

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const propertyTypes = ['Apartment', 'Bungalow', 'Villa', 'Townhouse', 'Maisonette'];
  const banks = ['KCB', 'Equity Bank', 'Cooperative Bank', 'NCBA Bank', 'Absa Bank', 'Standard Chartered', 'Barclays Bank'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    calculateCompletion();
    if (completionPercentage > 50) {
      loadCreditworthiness();
    }
  }, [profileData, documents]);

  const loadProfile = async () => {
    try {
      const profile = await api.getBuyerProfile();
      setProfileData(profile);
    } catch (error) {
      console.log('No existing profile found');
    }
  };

  const loadCreditworthiness = async () => {
    try {
      const assessment = await api.getCreditworthiness();
      setCreditScore(assessment.score);
      setRiskLevel(assessment.riskLevel);
    } catch (error) {
      console.log('Creditworthiness not available yet');
    }
  };

  const calculateCompletion = () => {
    const requiredFields = ['fullName', 'nationalId', 'employmentStatus', 'monthlyNetIncome', 'monthlyExpenses', 'preferredPropertyType', 'bankName', 'accountNumber'];
    const completedFields = requiredFields.filter(field => profileData[field]);
    const documentCount = Object.values(documents).filter(doc => doc).length;
    const percentage = Math.round(((completedFields.length + documentCount) / (requiredFields.length + 4)) * 100);
    setCompletionPercentage(percentage);
  };

  const handleDocumentUpload = async (type, file) => {
    try {
      setLoading(true);
      await api.uploadDocument({ type, file });
      setDocuments(prev => ({ ...prev, [type]: file.name }));
      alert('Document uploaded successfully!');
    } catch (error) {
      alert('Failed to upload document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateBuyerProfile(profileData);
      await loadCreditworthiness();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <div className="profile-step">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" name="fullName" value={profileData.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>National ID Number *</label>
          <input type="text" name="nationalId" value={profileData.nationalId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={profileData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>County of Residence *</label>
          <select name="county" value={profileData.county} onChange={handleChange} required>
            <option value="">Select County</option>
            {counties.map(county => <option key={county} value={county}>{county}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Marital Status</label>
          <select name="maritalStatus" value={profileData.maritalStatus} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Number of Dependents</label>
          <input type="number" name="dependents" value={profileData.dependents} onChange={handleChange} min="0" />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="profile-step">
      <h3>Employment & Income Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Employment Status *</label>
          <select name="employmentStatus" value={profileData.employmentStatus} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        <div className="form-group">
          <label>Employer Name</label>
          <input type="text" name="employerName" value={profileData.employerName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Occupation/Job Title</label>
          <input type="text" name="occupation" value={profileData.occupation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Employment Duration (years)</label>
          <input type="number" name="employmentDuration" value={profileData.employmentDuration} onChange={handleChange} min="0" step="0.5" />
        </div>
        <div className="form-group">
          <label>Monthly Gross Income (KSH) *</label>
          <input type="number" name="monthlyGrossIncome" value={profileData.monthlyGrossIncome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Monthly Net Income (KSH) *</label>
          <input type="number" name="monthlyNetIncome" value={profileData.monthlyNetIncome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Other Income Sources (KSH)</label>
          <input type="number" name="otherIncome" value={profileData.otherIncome} onChange={handleChange} />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="profile-step">
      <h3>Financial Obligations</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            <input type="checkbox" name="existingLoans" checked={profileData.existingLoans} onChange={handleChange} />
            I have existing loans
          </label>
        </div>
        {profileData.existingLoans && (
          <>
            <div className="form-group">
              <label>Loan Types</label>
              <input type="text" name="loanTypes" value={profileData.loanTypes} onChange={handleChange} placeholder="e.g., Car loan, SACCO loan" />
            </div>
            <div className="form-group">
              <label>Monthly Loan Repayments (KSH)</label>
              <input type="number" name="monthlyLoanRepayments" value={profileData.monthlyLoanRepayments} onChange={handleChange} />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Monthly Expenses (KSH) *</label>
          <input type="number" name="monthlyExpenses" value={profileData.monthlyExpenses} onChange={handleChange} required placeholder="Rent, utilities, school fees, etc." />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="profile-step">
      <h3>Property & Mortgage Preferences</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Preferred Property Type *</label>
          <select name="preferredPropertyType" value={profileData.preferredPropertyType} onChange={handleChange} required>
            <option value="">Select Type</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Target County *</label>
          <select name="targetCounty" value={profileData.targetCounty} onChange={handleChange} required>
            <option value="">Select County</option>
            {counties.map(county => <option key={county} value={county}>{county}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Estimated Property Value (KSH) *</label>
          <input type="number" name="estimatedPropertyValue" value={profileData.estimatedPropertyValue} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Desired Loan Amount (KSH) *</label>
          <input type="number" name="desiredLoanAmount" value={profileData.desiredLoanAmount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Repayment Period (years) *</label>
          <input type="number" name="repaymentPeriod" value={profileData.repaymentPeriod} onChange={handleChange} required min="1" max="30" />
        </div>
        <div className="form-group">
          <label>Down Payment Amount (KSH) *</label>
          <input type="number" name="downPaymentAmount" value={profileData.downPaymentAmount} onChange={handleChange} required />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="profile-step">
      <h3>Banking Information & Documents</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Bank Name *</label>
          <select name="bankName" value={profileData.bankName} onChange={handleChange} required>
            <option value="">Select Bank</option>
            {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Account Number *</label>
          <input type="text" name="accountNumber" value={profileData.accountNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>M-Pesa Number</label>
          <input type="text" name="mpesaNumber" value={profileData.mpesaNumber} onChange={handleChange} placeholder="254XXXXXXXXX" />
        </div>
      </div>
      
      <div className="documents-section">
        <h4>Required Documents</h4>
        <div className="document-uploads">
          <div className="document-item">
            <label>National ID *</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleDocumentUpload('nationalId', e.target.files[0])} />
            {documents.nationalId && <span className="uploaded">✓ {documents.nationalId}</span>}
          </div>
          <div className="document-item">
            <label>KRA PIN Certificate *</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleDocumentUpload('kraPin', e.target.files[0])} />
            {documents.kraPin && <span className="uploaded">✓ {documents.kraPin}</span>}
          </div>
          <div className="document-item">
            <label>Bank Statement (6 months)</label>
            <input type="file" accept=".pdf" onChange={(e) => handleDocumentUpload('bankStatement', e.target.files[0])} />
            {documents.bankStatement && <span className="uploaded">✓ {documents.bankStatement}</span>}
          </div>
          <div className="document-item">
            <label>Proof of Income</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleDocumentUpload('proofOfIncome', e.target.files[0])} />
            {documents.proofOfIncome && <span className="uploaded">✓ {documents.proofOfIncome}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Very High': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className="section">
      <h2>Complete Your Buyer Profile</h2>
      
      <div className="profile-summary">
        <div className="completion-card">
          <h4>Profile Completion</h4>
          <div className="completion-bar">
            <div className="completion-fill" style={{width: `${completionPercentage}%`}}></div>
          </div>
          <span>{completionPercentage}% Complete</span>
        </div>
        
        {creditScore && (
          <div className="credit-card">
            <h4>Creditworthiness Score</h4>
            <div className="credit-score">{creditScore}/100</div>
            <div className="risk-level" style={{color: getRiskColor(riskLevel)}}>
              {riskLevel} Risk
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-progress">
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="progress-labels">
          <span>Personal</span>
          <span>Employment</span>
          <span>Financial</span>
          <span>Property</span>
          <span>Banking</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        <div className="form-actions" style={{display: 'flex', gap: '1rem', justifyContent: 'space-between'}}>
          {currentStep > 1 && (
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep} style={{marginLeft: 'auto'}}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={loading} style={{marginLeft: 'auto'}}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BuyerProfile;