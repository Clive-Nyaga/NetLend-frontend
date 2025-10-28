import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function MortgageApplication({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Employment Information
    employmentStatus: 'employed',
    employer: '',
    jobTitle: '',
    monthlyIncome: '',
    employmentLength: '',
    
    // Financial Information
    loanAmount: '',
    downPayment: '',
    propertyValue: '',
    propertyAddress: '',
    loanPurpose: 'purchase',
    
    // Additional Information
    creditScore: '',
    monthlyDebts: '',
    assets: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const submitApplication = async () => {
    try {
      await axios.post(`${API_BASE}/homebuyer/applications`, formData);
      onComplete && onComplete();
    } catch (error) {
      alert('Failed to submit application');
    }
  };

  const renderPersonalInfo = () => (
    <div className="form-section">
      <h3>Personal Information</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          required
        />
      </div>
      <input
        type="date"
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
        required
      />
    </div>
  );

  const renderEmploymentInfo = () => (
    <div className="form-section">
      <h3>Employment Information</h3>
      <select
        value={formData.employmentStatus}
        onChange={(e) => updateFormData('employmentStatus', e.target.value)}
      >
        <option value="employed">Employed</option>
        <option value="self-employed">Self-Employed</option>
        <option value="unemployed">Unemployed</option>
        <option value="retired">Retired</option>
      </select>
      <input
        type="text"
        placeholder="Employer/Company"
        value={formData.employer}
        onChange={(e) => updateFormData('employer', e.target.value)}
      />
      <input
        type="text"
        placeholder="Job Title"
        value={formData.jobTitle}
        onChange={(e) => updateFormData('jobTitle', e.target.value)}
      />
      <input
        type="number"
        placeholder="Monthly Income (KSh)"
        value={formData.monthlyIncome}
        onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
      />
      <input
        type="text"
        placeholder="Employment Length (e.g., 2 years)"
        value={formData.employmentLength}
        onChange={(e) => updateFormData('employmentLength', e.target.value)}
      />
    </div>
  );

  const renderLoanDetails = () => (
    <div className="form-section">
      <h3>Loan Details</h3>
      <select
        value={formData.loanPurpose}
        onChange={(e) => updateFormData('loanPurpose', e.target.value)}
      >
        <option value="purchase">Home Purchase</option>
        <option value="refinance">Refinance</option>
        <option value="construction">Construction</option>
      </select>
      <input
        type="number"
        placeholder="Loan Amount (KSh)"
        value={formData.loanAmount}
        onChange={(e) => updateFormData('loanAmount', e.target.value)}
      />
      <input
        type="number"
        placeholder="Down Payment (KSh)"
        value={formData.downPayment}
        onChange={(e) => updateFormData('downPayment', e.target.value)}
      />
      <input
        type="number"
        placeholder="Property Value (KSh)"
        value={formData.propertyValue}
        onChange={(e) => updateFormData('propertyValue', e.target.value)}
      />
      <input
        type="text"
        placeholder="Property Address"
        value={formData.propertyAddress}
        onChange={(e) => updateFormData('propertyAddress', e.target.value)}
      />
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="form-section">
      <h3>Financial Information</h3>
      <input
        type="number"
        placeholder="Credit Score (300-850)"
        value={formData.creditScore}
        onChange={(e) => updateFormData('creditScore', e.target.value)}
      />
      <input
        type="number"
        placeholder="Monthly Debt Payments (KSh)"
        value={formData.monthlyDebts}
        onChange={(e) => updateFormData('monthlyDebts', e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Assets (KSh)"
        value={formData.assets}
        onChange={(e) => updateFormData('assets', e.target.value)}
      />
    </div>
  );

  return (
    <div className="mortgage-application">
      <div className="application-header">
        <h2>Mortgage Application</h2>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <p>Step {step} of 4</p>
      </div>

      <div className="application-form">
        {step === 1 && renderPersonalInfo()}
        {step === 2 && renderEmploymentInfo()}
        {step === 3 && renderLoanDetails()}
        {step === 4 && renderFinancialInfo()}

        <div className="form-actions">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {step < 4 ? (
            <button className="btn" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button className="btn success" onClick={submitApplication}>
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MortgageApplication;