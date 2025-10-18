import { useState } from 'react';

const MortgageProducts = () => {
  const [products, setProducts] = useState([]);

  const addProduct = () => {
    // Add product logic here
    console.log('Add new product');
  };

  return (
    <div id="products" className="section">
      <h2>Mortgage Products</h2>
      <button className="btn" onClick={addProduct}>Add New Product</button>
      <div id="productsList">
        {products.length === 0 ? (
          <p>No products available. Add your first mortgage product.</p>
        ) : (
          products.map((product, index) => (
            <div key={index} className="product-card">
              <h3>{product.name}</h3>
              <p>Interest Rate: {product.rate}%</p>
              <p>Term: {product.term} years</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MortgageProducts;