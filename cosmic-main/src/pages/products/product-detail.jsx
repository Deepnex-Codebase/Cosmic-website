import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Package, Tag, Percent, X } from 'lucide-react';
import { productService } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI states
  const [currentImage, setCurrentImage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  
  // Import environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  // Remove '/api' from the end for image URLs
  const BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        
        if (response.data && response.data.success) {
          setProduct(response.data.data);
          // Update page title
          document.title = `${response.data.data.title} - Product Details`;
        } else {
          setError('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Format image URL
  const formatImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.includes('/uploads/products/')) {
      return `${BASE_URL}${img}`;
    }
    return `${BASE_URL}/uploads/products/${img.split('/').pop()}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Product</h1>
            <p className="text-red-700">{error}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
            <Link 
              to="/products" 
              className="flex items-center justify-center text-primary hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link 
            to="/products" 
            className="flex items-center justify-center text-primary hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Prepare product images
  const productImage = product.image ? formatImageUrl(product.image) : '/placeholder-product.png';
  const hoverImage = product.hoverImage ? formatImageUrl(product.hoverImage) : productImage;
  const additionalImages = product.images ? product.images.map(img => formatImageUrl(img)) : [];

  return (
    <div className="min-h-screen bg-[#f8faf9] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/products" 
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Products
          </Link>
          
          {/* Product ID */}
          <div className="text-sm text-gray-500">
            Product ID: {product._id}
          </div>
        </div>

        {/* Product Detail Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="border border-gray-100 rounded-lg overflow-hidden bg-white p-4 flex justify-center items-center h-[400px] cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => {
                  setModalImage(isHovering ? hoverImage : productImage);
                  setShowModal(true);
                }}
              >
                <img 
                  src={isHovering ? hoverImage : productImage} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain transition-opacity duration-300"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>
              
              {/* Additional Images */}
              {additionalImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {additionalImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-100 rounded-lg overflow-hidden bg-white p-2 h-24 cursor-pointer"
                      onClick={() => {
                        setModalImage(img);
                        setShowModal(true);
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} - Image ${index + 1}`} 
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-gray-600 text-lg">{product.category}</p>
                  
                  {/* Status Tags */}
                  {product.status && product.status.length > 0 && (
                    <div className="flex space-x-2">
                      {product.status.map((status, index) => {
                        let bgColor = 'bg-gray-100';
                        let textColor = 'text-gray-800';
                        
                        if (status === 'Sale') {
                          bgColor = 'bg-red-100';
                          textColor = 'text-red-800';
                        } else if (status === 'New') {
                          bgColor = 'bg-green-100';
                          textColor = 'text-green-800';
                        } else if (status === 'Featured') {
                          bgColor = 'bg-blue-100';
                          textColor = 'text-blue-800';
                        } else if (status === 'Sold') {
                          bgColor = 'bg-yellow-100';
                          textColor = 'text-yellow-800';
                        }
                        
                        return (
                          <span 
                            key={index} 
                            className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full font-medium`}
                          >
                            {status}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating || 0} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price and Discount */}
              <div className="flex items-center space-x-3">
                {product.newPrice && (
                  <span className="text-2xl font-bold text-primary">₹{product.newPrice.toLocaleString()}</span>
                )}
                {product.oldPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{product.oldPrice.toLocaleString()}</span>
                )}
                {product.oldPrice && product.newPrice && product.oldPrice > product.newPrice && (
                  <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-md flex items-center">
                    {Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              
              {/* Stock and Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Package size={16} className="mr-1 text-gray-600" />
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Tag size={16} className="mr-1 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {product.isActive ? 'Active' : 'Inactive'}
                    {product.isFeatured && ', Featured'}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">
                  {product.description || 'No description available.'}
                </p>
              </div>
              
              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications)
                      .filter(([key, value]) => 
                        !['description', 'features', 'images', 'reviews', '_id', '__v'].includes(key) && 
                        value && value.toString().trim() !== ''
                      )
                      .map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}: 
                          </span>
                          <span className="ml-2 text-gray-600">{value}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center h-[80vh]">
              <img 
                src={modalImage} 
                alt={product.title} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;