import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function HomebuyerDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [preApproval, setPreApproval] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loanProducts, setLoanProducts] = useState([]);
  const [eligibilityScore, setEligibilityScore] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [appsRes, propsRes, preApprovalRes, profileRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE}/homebuyer/applications`).catch(() => ({data: []})),
        axios.get(`${API_BASE}/homebuyer/saved-properties`).catch(() => ({data: []})),
        axios.get(`${API_BASE}/homebuyer/pre-approval`).catch(() => ({data: null})),
        axios.get(`${API_BASE}/homebuyer/profile`).catch(() => ({data: null})),
        axios.get(`${API_BASE}/loan-products`).catch(() => ({data: []}))
      ]);
      setApplications(appsRes.data || []);
      setSavedProperties(propsRes.data || []);
      setPreApproval(preApprovalRes.data);
      setProfile(profileRes.data);
      setLoanProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const renderOverview = () => (
    <div className="section">
      <h2>Your Homebuying Journey</h2>
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Active Applications</h3>
          <div className="stat-number">{applications.filter(a => a.status === 'pending').length}</div>
        </div>
        <div className="stat-card">
          <h3>Saved Properties</h3>
          <div className="stat-number">{savedProperties.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pre-Approval Status</h3>
          <div className="stat-number">{preApproval ? 'Approved' : 'Pending'}</div>
        </div>
      </div>
      
      <div className="journey-steps">
        <h3>Your Mortgage Journey</h3>
        <div className="steps-grid">
          <div className={`step-card ${!profile ? 'active' : 'completed'}`}>
            <div className="step-number">1</div>
            <h4>Complete Profile</h4>
            <p>Set up your financial profile and upload documents</p>
            <button className="btn" onClick={() => setActiveSection('profile')}>
              {profile ? 'Update Profile' : 'Complete Profile'}
            </button>
          </div>
          <div className={`step-card ${profile && !eligibilityScore ? 'active' : profile && eligibilityScore ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <h4>Check Eligibility</h4>
            <p>See which lenders you qualify with</p>
            <button className="btn" onClick={() => setActiveSection('eligibility')} disabled={!profile}>
              Check Eligibility
            </button>
          </div>
          <div className={`step-card ${eligibilityScore ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <h4>Compare Loans</h4>
            <p>Compare mortgage offers from multiple lenders</p>
            <button className="btn" onClick={() => setActiveSection('compare')} disabled={!eligibilityScore}>
              Compare Loans
            </button>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Apply for Mortgage</h4>
            <p>Submit your formal mortgage application</p>
            <button className="btn" onClick={() => setActiveSection('apply')}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="section">
      <h2>My Applications</h2>
      <div className="applications-list">
        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>No Applications Yet</h3>
            <p>Start your homebuying journey by applying for a mortgage</p>
            <button className="btn">Start Application</button>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="app-card">
              <div className="app-info">
                <h4>Application #{app.id}</h4>
                <p>Property: {app.propertyAddress}</p>
                <p>Loan Amount: KSh {app.loanAmount?.toLocaleString()}</p>
                <p>Lender: {app.lender}</p>
                <p>Submitted: {app.submittedDate}</p>
              </div>
              <span className={`status ${app.status}`}>{app.status.toUpperCase()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="section">
      <h2>Complete Your Profile</h2>
      <div className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <input type="text" placeholder="Full Name" />
            <input type="date" placeholder="Date of Birth" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="ID Number" />
            <input type="tel" placeholder="Phone Number" />
          </div>
        </div>
        <div className="form-section">
          <h3>Employment & Income</h3>
          <select><option>Employment Type</option><option>Employed</option><option>Self-Employed</option></select>
          <input type="text" placeholder="Employer/Company" />
          <input type="number" placeholder="Monthly Income (KSh)" />
          <input type="text" placeholder="Years of Employment" />
        </div>
        <div className="form-section">
          <h3>Financial Information</h3>
          <input type="number" placeholder="Credit Score (if known)" />
          <input type="number" placeholder="Monthly Expenses (KSh)" />
          <input type="number" placeholder="Existing Debts (KSh)" />
        </div>
        <div className="form-section">
          <h3>Document Upload</h3>
          <div className="upload-grid">
            <div className="upload-item">
              <label>ID Copy</label>
              <input type="file" accept=".pdf,.jpg,.png" />
            </div>
            <div className="upload-item">
              <label>Payslips (3 months)</label>
              <input type="file" accept=".pdf" multiple />
            </div>
            <div className="upload-item">
              <label>Bank Statements</label>
              <input type="file" accept=".pdf" multiple />
            </div>
          </div>
        </div>
        <button className="btn success">Save Profile</button>
      </div>
    </div>
  );

  const renderEligibility = () => (
    <div className="section">
      <h2>Eligibility Check</h2>
      {eligibilityScore ? (
        <div className="eligibility-results">
          <div className="score-card">
            <h3>Your Eligibility Score</h3>
            <div className="score-circle">
              <span className="score">{eligibilityScore}%</span>
            </div>
            <p>You're eligible for loans up to KSh 15M</p>
          </div>
          <div className="eligible-lenders">
            <h3>Eligible Lenders</h3>
            <div className="lenders-grid">
              <div className="lender-card">
                <h4>KCB Bank</h4>
                <p>Rate: 12.5% - 15%</p>
                <span className="status approved">Eligible</span>
              </div>
              <div className="lender-card">
                <h4>Equity Bank</h4>
                <p>Rate: 13% - 16%</p>
                <span className="status approved">Eligible</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="eligibility-check">
          <p>Check your eligibility with our partner lenders</p>
          <button className="btn" onClick={() => setEligibilityScore(85)}>Run Eligibility Check</button>
        </div>
      )}
    </div>
  );

  const renderLoanComparison = () => (
    <div className="section">
      <h2>Compare Loan Products</h2>
      <div className="comparison-filters">
        <select><option>All Lenders</option></select>
        <select><option>Loan Type</option><option>Fixed Rate</option><option>Variable Rate</option></select>
        <input type="range" min="5" max="30" placeholder="Loan Term (years)" />
      </div>
      <div className="loans-comparison">
        {loanProducts.map(product => (
          <div key={product.id} className="loan-card">
            <h4>{product.lender}</h4>
            <div className="rate">{product.interestRate}% p.a.</div>
            <p>Term: {product.maxTerm} years</p>
            <p>Max Amount: KSh {product.maxAmount?.toLocaleString()}</p>
            <div className="loan-features">
              <span>✓ No processing fee</span>
              <span>✓ Flexible repayment</span>
            </div>
            <button className="btn">Select This Loan</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplication = () => (
    <div className="section">
      <h2>Mortgage Application</h2>
      <div className="application-form">
        <div className="form-section">
          <h3>Loan Details</h3>
          <div className="form-row">
            <input type="number" placeholder="Loan Amount (KSh)" />
            <select><option>Loan Purpose</option><option>Home Purchase</option><option>Refinancing</option></select>
          </div>
          <input type="number" placeholder="Property Value (KSh)" />
          <input type="text" placeholder="Property Address" />
        </div>
        <div className="form-section">
          <h3>Property Documents</h3>
          <div className="upload-grid">
            <div className="upload-item">
              <label>Sale Agreement</label>
              <input type="file" accept=".pdf" />
            </div>
            <div className="upload-item">
              <label>Valuation Report</label>
              <input type="file" accept=".pdf" />
            </div>
            <div className="upload-item">
              <label>Title Deed</label>
              <input type="file" accept=".pdf" />
            </div>
          </div>
        </div>
        <button className="btn success">Submit Application</button>
      </div>
    </div>
  );

  const renderSavedProperties = () => (
    <div className="section">
      <h2>Saved Properties</h2>
      <div className="properties-grid">
        {savedProperties.length === 0 ? (
          <div className="no-properties">
            <h3>No Saved Properties</h3>
            <p>Browse and save properties you're interested in</p>
            <button className="btn">Browse Properties</button>
          </div>
        ) : (
          savedProperties.map(prop => (
            <div key={prop.id} className="property-card">
              <h3>{prop.title}</h3>
              <div className="price">KSh {prop.price?.toLocaleString()}</div>
              <p>{prop.location}</p>
              <p>{prop.bedrooms} bed • {prop.bathrooms} bath</p>
              <button className="btn">View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Homebuyer Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
          <li><a onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>My Profile</a></li>
          <li><a onClick={() => setActiveSection('eligibility')} className={activeSection === 'eligibility' ? 'active' : ''}>Eligibility</a></li>
          <li><a onClick={() => setActiveSection('compare')} className={activeSection === 'compare' ? 'active' : ''}>Compare Loans</a></li>
          <li><a onClick={() => setActiveSection('apply')} className={activeSection === 'apply' ? 'active' : ''}>Apply</a></li>
          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>My Applications</a></li>
          <li><a onClick={() => setActiveSection('properties')} className={activeSection === 'properties' ? 'active' : ''}>Saved Properties</a></li>
        </ul>
      </div>
      <div className="main-content">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'profile' && renderProfile()}
        {activeSection === 'eligibility' && renderEligibility()}
        {activeSection === 'compare' && renderLoanComparison()}
        {activeSection === 'apply' && renderApplication()}
        {activeSection === 'applications' && renderApplications()}
        {activeSection === 'properties' && renderSavedProperties()}
      </div>
    </div>
  );
}

export default HomebuyerDashboard;