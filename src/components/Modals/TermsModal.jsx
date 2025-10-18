const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content terms-modal">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>NetLend Terms and Conditions</h2>
        <div className="terms-full-content">
          <h3>1. Introduction</h3>
          <p>NetLend is a web-based mortgage facilitation platform that connects borrowers seeking mortgage loans with lenders (banks, SACCOs, or private institutions) offering mortgage products.</p>
          <p>By using NetLend, users agree to these Terms and Conditions, which define the rights, obligations, and responsibilities of all parties involved.</p>
          <p>These Terms are governed by the laws of Kenya, including the Data Protection Act (2019), Central Bank of Kenya (CBK) guidelines, and relevant Consumer Protection laws.</p>

          <h3>2. Definitions</h3>
          <p><strong>"Platform"</strong> – The NetLend web application.</p>
          <p><strong>"Borrower"</strong> – A registered user applying for a mortgage.</p>
          <p><strong>"Lender"</strong> – A registered financial institution or licensed individual providing mortgage options through the platform.</p>
          <p><strong>"Administrator"</strong> – NetLend's internal staff responsible for moderation, compliance, and support.</p>
          <p><strong>"Account"</strong> – A user's registered profile with NetLend.</p>
          <p><strong>"Mortgage Product"</strong> – A loan offer or package made available to borrowers by a lender.</p>
          <p><strong>"KYC"</strong> (Know Your Customer) – A verification process for user identity and financial credibility.</p>
          <p><strong>"Refinancing Offer"</strong> – An alternative loan proposal for an existing borrower to adjust or replace their current mortgage terms.</p>

          <h3>3. Eligibility</h3>
          <h4>Borrowers must:</h4>
          <ul>
            <li>Be Kenyan citizens or legal residents.</li>
            <li>Be over 18 years old.</li>
            <li>Have verifiable income and identification documents (National ID, KRA PIN, payslips, etc.).</li>
          </ul>
          <h4>Lenders must:</h4>
          <ul>
            <li>Be licensed financial institutions or approved lending entities.</li>
            <li>Submit proof of registration and compliance with CBK and SACCO regulatory frameworks.</li>
            <li>Agree to NetLend's audit and data-sharing policies for transparency.</li>
          </ul>

          <h3>4. Account Creation and Verification</h3>
          <h4>Borrowers</h4>
          <ul>
            <li>Must provide accurate information during registration.</li>
            <li>Must verify their identity through ID and proof of income.</li>
            <li>Can update or delete their accounts at any time, subject to pending loan obligations.</li>
          </ul>
          <h4>Lenders</h4>
          <ul>
            <li>Must register institutional details, business registration numbers, and licensing documentation.</li>
            <li>Must complete KYC and AML (Anti-Money Laundering) compliance verification.</li>
            <li>Can be suspended or delisted if found violating NetLend's financial ethics.</li>
          </ul>
          <h4>Administrators</h4>
          <ul>
            <li>Reserve the right to review and verify all accounts.</li>
            <li>May request additional documentation for due diligence.</li>
          </ul>

          <h3>5. Platform Functionality and Usage</h3>
          <p>NetLend does not directly issue loans; it facilitates communication between borrowers and lenders.</p>
          <h4>Borrowers can:</h4>
          <ul>
            <li>Compare mortgage offers.</li>
            <li>Calculate eligibility and repayment plans.</li>
            <li>Apply for loans directly through lender listings.</li>
            <li>Manage active mortgages and view repayment reminders.</li>
          </ul>
          <h4>Lenders can:</h4>
          <ul>
            <li>List, modify, and manage mortgage products.</li>
            <li>View and respond to borrower applications.</li>
            <li>Track repayment statuses and generate performance insights.</li>
          </ul>

          <h3>6. Loan Application and Approval</h3>
          <ul>
            <li>Borrowers must ensure all provided information is truthful and complete.</li>
            <li>Lenders are solely responsible for reviewing borrower applications, conducting due diligence, and approving or rejecting applications based on internal lending policies.</li>
            <li>NetLend is not liable for the financial relationship or contractual terms between a borrower and lender once a mortgage is issued.</li>
          </ul>

          <h3>7. Fees and Payments</h3>
          <h4>Borrowers may be charged:</h4>
          <ul>
            <li>Processing fees by the lender (as disclosed upfront).</li>
            <li>Platform usage fees (if applicable in later phases).</li>
          </ul>
          <h4>Lenders may pay:</h4>
          <ul>
            <li>Subscription or listing fees to maintain visibility on NetLend.</li>
          </ul>
          <p>All payments should occur through secure and verified payment gateways integrated with the platform (e.g., M-Pesa, bank transfers).</p>

          <h3>8. Data Privacy and Security</h3>
          <ul>
            <li>NetLend commits to full compliance with Kenya's Data Protection Act (2019).</li>
            <li>User data (personal, financial, or institutional) is securely stored and never shared with unauthorized third parties.</li>
            <li>Lenders and borrowers agree to allow NetLend to process their data only for legitimate business purposes (loan matching, verification, and reporting).</li>
            <li>Data breaches, if any, must be reported within 72 hours as per the Act.</li>
          </ul>

          <h3>9. Intellectual Property</h3>
          <ul>
            <li>All trademarks, code, and branding associated with NetLend are the property of NetLend Limited.</li>
            <li>Users may not reproduce, distribute, or alter the platform's content or software without explicit permission.</li>
          </ul>

          <h3>10. User Responsibilities</h3>
          <h4>Borrowers must:</h4>
          <ul>
            <li>Maintain accuracy of information.</li>
            <li>Make timely repayments.</li>
            <li>Notify lenders of changes in financial conditions.</li>
          </ul>
          <h4>Lenders must:</h4>
          <ul>
            <li>Disclose all mortgage terms transparently (interest rates, tenure, penalties).</li>
            <li>Keep borrower data confidential.</li>
            <li>Follow fair lending practices.</li>
          </ul>
          <h4>Admins must:</h4>
          <ul>
            <li>Uphold platform neutrality.</li>
            <li>Maintain compliance with regulatory authorities.</li>
            <li>Protect user data integrity.</li>
          </ul>

          <h3>11. Prohibited Activities</h3>
          <p>Users are strictly prohibited from:</p>
          <ul>
            <li>Submitting fraudulent information or forged documents.</li>
            <li>Using the platform for money laundering or illegal lending.</li>
            <li>Tampering with the system's data or security infrastructure.</li>
            <li>Engaging in discriminatory or unethical lending practices.</li>
          </ul>

          <h3>12. Liability Disclaimer</h3>
          <p>NetLend acts as a facilitator, not a lender or financial guarantor.</p>
          <p>NetLend is not responsible for:</p>
          <ul>
            <li>Loan defaults, penalties, or disputes.</li>
            <li>Loss of funds due to misrepresentation.</li>
            <li>System outages beyond reasonable control.</li>
          </ul>

          <h3>13. Suspension and Termination</h3>
          <p>Accounts may be suspended or terminated if users:</p>
          <ul>
            <li>Breach these Terms.</li>
            <li>Engage in unlawful conduct.</li>
            <li>Refuse to comply with verification requests.</li>
          </ul>
          <p>Suspended users will lose access until the issue is resolved or permanently barred if found culpable.</p>

          <h3>14. Updates to Terms</h3>
          <ul>
            <li>NetLend reserves the right to update these Terms at any time.</li>
            <li>Significant changes will be communicated via email and platform notifications.</li>
          </ul>

          <h3>15. Governing Law and Dispute Resolution</h3>
          <ul>
            <li>All disputes will be governed under Kenyan law.</li>
            <li>Disputes arising between users and NetLend will first be resolved through mediation.</li>
            <li>If unresolved, disputes may be escalated to the Kenya Information and Communications Tribunal or relevant financial ombudsman.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;