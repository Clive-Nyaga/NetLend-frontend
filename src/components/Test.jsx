const Test = () => {
  const testBuyerLogin = () => {
    const userData = {
      id: 1,
      full_name: 'Test Buyer',
      email: 'test@buyer.com',
      user_type: 'buyer'
    };
    
    // Simulate successful registration/login
    window.dispatchEvent(new CustomEvent('buyerLogin', { detail: userData }));
    alert('Buyer login simulated!');
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
      <h3>Quick Buyer Test</h3>
      <button onClick={testBuyerLogin} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Login as Test Buyer
      </button>
    </div>
  );
};

export default Test;