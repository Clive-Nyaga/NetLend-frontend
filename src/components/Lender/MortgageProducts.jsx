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
    // This would open a form modal in a real implementation
    const productData = {
      name: 'New Product',
      rate: 6.5,
      term: 30
    };
    try {
      await api.createProduct(lenderId, productData);
      loadProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
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