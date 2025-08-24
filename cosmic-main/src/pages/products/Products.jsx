import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/api'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts({
        isActive: true,
        limit: 50
      });
      
      console.log('Products API Response:', response);
      
      // Axios returns full response object, we need response.data
      if (response.data && response.data.success && response.data.data) {
        setProducts(response.data.data || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/products/product-detail/${product._id}`}>
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={product.image ? 
                      (product.image.startsWith('http') ? 
                        product.image : 
                        (product.image.startsWith('/uploads/') ? 
                          `https://api.cosmicpowertech.com${product.image}` : 
                          `https://api.cosmicpowertech.com/uploads/${product.image}`)
                      ) : 
                      '/placeholder-product.jpg'} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  {product.hoverImage && (
                    <img 
                      src={product.hoverImage.startsWith('http') ? 
                        product.hoverImage : 
                        (product.hoverImage.startsWith('/uploads/') ? 
                          `https://api.cosmicpowertech.com${product.hoverImage}` : 
                          `https://api.cosmicpowertech.com/uploads/${product.hoverImage}`)
                      } 
                      alt={`${product.title} hover`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      {/* Display new price if it exists and is greater than 0 */}
                      {product.newPrice && product.newPrice > 0 && (
                        <span className="text-accent-600 font-bold">₹{product.newPrice.toLocaleString()}</span>
                      )}
                      
                      {/* Display old price only if it's greater than new price and both are greater than 0 */}
                      {product.oldPrice && product.newPrice && 
                       product.oldPrice > 0 && product.newPrice > 0 && 
                       product.oldPrice > product.newPrice && (
                        <span className="text-gray-400 line-through ml-2">₹{product.oldPrice.toLocaleString()}</span>
                      )}
                      
                      {/* Show discount percentage if applicable */}
                      {product.oldPrice && product.newPrice && 
                       product.oldPrice > 0 && product.newPrice > 0 && 
                       product.oldPrice > product.newPrice && (
                        <span className="text-green-600 text-sm ml-2">
                          ({Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)}% off)
                        </span>
                      )}
                      
                      {/* Show "Price on Request" if price is 0 or not available */}
                      {(!product.newPrice || product.newPrice === 0) && (
                        <span className="text-accent-600 font-bold">Price on Request</span>
                      )}
                    </div>
                    <span className="bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded">{product.category}</span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
