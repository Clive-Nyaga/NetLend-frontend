import { useState } from 'react';

const Refinancing = () => {
  const [refinancingOptions, setRefinancingOptions] = useState([]);

  return (
    <div id="refinancing" className="section">
      <h2>Refinancing Options</h2>
      <div id="refinancingList">
        {refinancingOptions.length === 0 ? (
          <p>No refinancing options available.</p>
        ) : (
          refinancingOptions.map((option, index) => (
            <div key={index} className="offer-card">
              <h3>{option.title}</h3>
              <p>New Rate: {option.newRate}%</p>
              <p>Savings: ${option.savings?.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Refinancing;