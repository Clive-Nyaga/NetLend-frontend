import { useState, useEffect } from 'react';
import api from '../../services/api';

const MortgageProducts = ({ lenderId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [lenderId]);

  const loadProducts = async () => {
    try {
      const response = await api.getLenderProducts(lenderId);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    const name = prompt('Product Name:', 'Fixed Rate Mortgage');
    if (!name) return;
    
    const rate = prompt('Interest Rate (%):', '12.5');
    if (!rate) return;
    
    const term = prompt('Term (years):', '30');
    if (!term) return;
    
    const productData = {
      name: name,
      rate: parseFloat(rate),
      term: parseInt(term)
    };
    
    try {
      await api.createProduct(lenderId, productData);
      alert('Product created successfully!');
      loadProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Backend endpoint may not be ready.');
    }
  };

  return (
    <div id="products" className="section">
      <h2>Mortgage Products</h2>
      <button className="btn" onClick={addProduct}>Add New Product</button>
      <div id="productsList">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
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