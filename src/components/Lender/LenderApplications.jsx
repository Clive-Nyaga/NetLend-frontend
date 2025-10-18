import { useState, useEffect } from 'react';

const LenderApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch applications from API
    // setApplications(fetchedApplications);
  }, []);

  return (
    <div id="lenderApplications" className="section">
      <h2>Mortgage Applications</h2>
      <div id="lenderAppsList">
        {applications.length === 0 ? (
          <p>No applications received yet.</p>
        ) : (
          applications.map((app, index) => (
            <div key={index} className="app-card">
              <h3>Application #{app.id}</h3>
              <p>Applicant: {app.applicantName}</p>
              <p>Amount: ${app.amount?.toLocaleString()}</p>
              <p>Status: <span className={`status ${app.status}`}>{app.status}</span></p>
              <div>
                <button className="btn success">Approve</button>
                <button className="btn danger">Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LenderApplications;