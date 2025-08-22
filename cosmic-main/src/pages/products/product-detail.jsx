import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Heart, Share2, Facebook, Twitter, Linkedin, Star, Info, Check, Shield, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import RequestQuoteModal from '../../components/RequestQuoteModal';
import { productService, reviewService, wishlistService, configService } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  
  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Related products and reviews
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Dynamic configuration
  const [companyConfig, setCompanyConfig] = useState({ name: 'Cosmic Solar Solutions' });
  const [currencyConfig, setCurrencyConfig] = useState({ symbol: '₹', code: 'INR' });
  
  // Wishlist state
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // SEO and meta data update function
  const updatePageMeta = useCallback((productData) => {
    if (!productData) return;
    
    // Update page title
    document.title = `${productData.title} - ${companyConfig.name}`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = `${productData.description || productData.title} - High-quality solar products from ${companyConfig.name}. Price: ${currencyConfig.symbol}${productData.newPrice || productData.price}`;
    
    // Add structured data for SEO
    const existingStructuredData = document.querySelector('script[type="application/ld+json"]');
    if (existingStructuredData) {
      existingStructuredData.remove();
    }
    
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.title,
      "description": productData.description || productData.title,
      "image": productData.images && productData.images.length > 0 
        ? productData.images.map(img => img.startsWith('/uploads/') ? `${window.location.origin}${img}` : `${window.location.origin}/uploads/${img}`)
        : [`${window.location.origin}/placeholder-product.png`],
      "offers": {
        "@type": "Offer",
        "price": (productData.newPrice || productData.price || '0').replace(/[^0-9.]/g, ''),
        "priceCurrency": "INR",
        "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "brand": {
        "@type": "Brand",
        "name": companyConfig.name
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": productData.averageRating || productData.rating || 4.5,
        "reviewCount": productData.reviewCount || reviews.length || 1
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [companyConfig.name, currencyConfig.symbol, reviews.length]);

  // Load configuration data
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [companyData, currencyData] = await Promise.all([
          configService.getCompanyConfig().catch(() => ({ name: 'Cosmic Solar Solutions' })),
          configService.getCurrencyConfig().catch(() => ({ symbol: '₹', code: 'INR' }))
        ]);
        setCompanyConfig(companyData);
        setCurrencyConfig(currencyData);
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };
    loadConfig();
  }, []);

  // Check wishlist status
  const checkWishlistStatus = useCallback(async () => {
    if (!id) return;
    try {
      const response = await wishlistService.isInWishlist(id);
      setIsWishlisted(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setIsWishlisted(false);
    }
  }, [id]);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main product data
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Check wishlist status
        checkWishlistStatus();
        
        // Update SEO meta data
        updatePageMeta(productData);
        
        // Fetch related products with smart recommendations
        if (productData.category) {
          setRelatedLoading(true);
          try {
            let relatedData = [];
            
            // First try to get related products by product ID
            try {
              relatedData = await productService.getRelatedProducts(id);
            } catch (relatedError) {
              console.log('No specific related products found, implementing smart recommendations');
              
              // Smart recommendation logic
              const categoryProducts = await productService.getProductsByCategory(productData.category);
              
              // Filter out current product and inactive products
              const filteredProducts = categoryProducts.filter(p => 
                p._id !== productData._id && p.isActive && p.stock > 0
              );
              
              // Sort by relevance: similar price range, features, rating
              const currentPrice = parseFloat((productData.newPrice || productData.price || '0').replace(/[^0-9.]/g, ''));
              
              const scoredProducts = filteredProducts.map(p => {
                const productPrice = parseFloat((p.newPrice || p.price || '0').replace(/[^0-9.]/g, ''));
                let score = 0;
                
                // Price similarity (closer price = higher score)
                const priceDiff = Math.abs(currentPrice - productPrice);
                const priceScore = Math.max(0, 100 - (priceDiff / currentPrice) * 100);
                score += priceScore * 0.3;
                
                // Rating score
                score += (p.averageRating || 0) * 20;
                
                // Featured products get bonus
                if (p.isFeatured) score += 10;
                
                // Stock availability bonus
                if (p.stock > 10) score += 5;
                
                return { ...p, recommendationScore: score };
              });
              
              // Sort by score and take top products
              relatedData = scoredProducts
                .sort((a, b) => b.recommendationScore - a.recommendationScore)
                .slice(0, 6);
              
              // If still no products, fallback to featured products
              if (relatedData.length === 0) {
                try {
                  const featuredData = await productService.getFeaturedProducts();
                  relatedData = featuredData.filter(p => p._id !== productData._id && p.isActive);
                } catch (featuredError) {
                  console.error('Error fetching featured products:', featuredError);
                }
              }
            }
            
            setRelatedProducts(relatedData.slice(0, 4) || []); // Limit to 4 products
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            setRelatedProducts([]);
          } finally {
            setRelatedLoading(false);
          }
        }
        
        // Fetch product reviews
        setReviewsLoading(true);
        try {
          const reviewsData = await reviewService.getProductReviews(id);
          setReviews(reviewsData || []);
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    
    // Cleanup function
    return () => {
      // Reset page title
      document.title = 'Cosmic Solar Solutions';
      
      // Remove structured data
      const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (structuredDataScript) {
        structuredDataScript.remove();
      }
    };
  }, [id]);

  // Quantity handlers
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Wishlist handler
  const toggleWishlist = async () => {
    if (wishlistLoading) return;
    
    try {
      setWishlistLoading(true);
      
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(id);
        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Revert the state if API call fails
    } finally {
      setWishlistLoading(false);
    }
  };
  
  // Format price with currency
  const formatPrice = useCallback((price) => {
    if (!price || price === 0 || price === '0') return `${currencyConfig.symbol}0`;
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    if (numericPrice === 0 || isNaN(numericPrice)) return `${currencyConfig.symbol}0`;
    return `${currencyConfig.symbol}${numericPrice.toLocaleString()}`;
  }, [currencyConfig.symbol]);

  // Share handlers
  const shareProduct = (platform) => {
    const url = window.location.href;
    const title = product?.title || 'Check out this solar product';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        break;
    }
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
              to="/products/solar-panels" 
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
            to="/products/solar-panels" 
            className="flex items-center justify-center text-primary hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Prepare product images
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.startsWith('/uploads/') ? img : `/uploads/${img}`)
    : [product.image, product.hoverImage].filter(Boolean).map(img => img.startsWith('/uploads/') ? img : `/uploads/${img}`);

  // If no images, use placeholder
  if (productImages.length === 0) {
    productImages.push('/placeholder-product.png');
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/products/solar-panels" className="text-gray-500 hover:text-primary transition-colors">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            {product.category && (
              <>
                <Link 
                  to={`/products?category=${encodeURIComponent(product.category)}`} 
                  className="text-gray-500 hover:text-primary transition-colors capitalize"
                >
                  {product.category}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            )}
            <span className="text-primary font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] border border-gray-100 rounded-lg overflow-hidden bg-white">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
                
                {/* Status badges */}
                {product.status && product.status.length > 0 && (
                  <div className="absolute top-4 left-4 space-y-2 z-10">
                    {product.status.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs font-bold px-3 py-1 rounded-full inline-block shadow-md ${
                          tag === 'Sale'
                            ? 'bg-red-500 text-white'
                            : tag === 'New'
                            ? 'bg-green-500 text-white'
                            : tag === 'Featured'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Discount badge */}
                {product.oldPrice && product.newPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {(() => {
                      const oldPrice = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                      const newPrice = parseFloat(product.newPrice.replace(/[^0-9.]/g, ''));
                      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
                      return `${discount}% OFF`;
                    })()} 
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-primary shadow-md scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-gray-600 text-lg">{product.category}</p>
              </div>
              
              {/* Ratings */}
              <div className="flex items-center space-x-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < (product.averageRating || product.rating || 0) ? "currentColor" : "none"} 
                      className="stroke-current"
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.averageRating || product.rating || 0} 
                </span>
                <span className="text-gray-500">
                  ({product.reviewCount || reviews.length || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                {product.oldPrice && parseFloat(product.oldPrice.replace(/[^0-9.]/g, '')) > 0 && (
                  <p className="text-lg line-through text-gray-400">{formatPrice(product.oldPrice)}</p>
                )}
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.newPrice || product.price)}
                </p>
                {product.oldPrice && product.newPrice && (() => {
                  const oldPrice = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                  const newPrice = parseFloat(product.newPrice.replace(/[^0-9.]/g, ''));
                  return oldPrice > 0 && newPrice > 0 && oldPrice > newPrice;
                })() && (
                  <p className="text-lg font-semibold text-green-600">
                    You Save: {(() => {
                      const oldPrice = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                      const newPrice = parseFloat(product.newPrice.replace(/[^0-9.]/g, ''));
                      const savings = oldPrice - newPrice;
                      const percentage = Math.round((savings / oldPrice) * 100);
                      return `${formatPrice(savings)} (${percentage}%)`;
                    })()} 
                  </p>
                )}
              </div>
              
              {/* Short Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {product.description 
                    ? product.description.length > 200 
                      ? product.description.substring(0, 200) + '...' 
                      : product.description
                    : 'High-quality solar product designed for maximum efficiency and long-lasting performance.'}
                </p>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    product.isActive && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-semibold ${
                    product.isActive && product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.isActive && product.stock > 0 
                      ? `In Stock (${product.stock} available)` 
                      : 'Out of Stock'
                    }
                  </span>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-sm text-orange-600 font-medium">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="space-y-3">
                <label htmlFor="quantity" className="block text-lg font-semibold text-gray-900">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 p-3 rounded-lg border border-gray-300 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stock || 999}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 p-3 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.stock || 999)}
                    className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 p-3 rounded-lg border border-gray-300 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={!product.isActive || product.stock <= 0}
                  className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 text-lg"
                >
                  <FileText size={20} className="mr-2" />
                  {product.isActive && product.stock > 0 ? 'Request Quote' : 'Out of Stock'}
                </button>
                <button 
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`flex-1 border-2 font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 text-lg ${
                    wishlistLoading
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isWishlisted 
                      ? 'border-red-500 bg-red-500 text-white hover:bg-red-600' 
                      : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {wishlistLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Heart size={20} className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  )}
                  {wishlistLoading ? 'Loading...' : isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
              
              {/* Additional Info */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Shield size={18} className="mr-2 text-primary flex-shrink-0" />
                    <span>Warranty: {product.specifications?.warranty || '1 Year'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Truck size={18} className="mr-2 text-primary flex-shrink-0" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <RefreshCw size={18} className="mr-2 text-primary flex-shrink-0" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
              
              {/* Social Share */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Share:</span>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => shareProduct('facebook')}
                      className="text-gray-400 hover:text-[#3b5998] transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                      <Facebook size={20} />
                    </button>
                    <button 
                      onClick={() => shareProduct('twitter')}
                      className="text-gray-400 hover:text-[#1da1f2] transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                      <Twitter size={20} />
                    </button>
                    <button 
                      onClick={() => shareProduct('linkedin')}
                      className="text-gray-400 hover:text-[#0077b5] transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                      <Linkedin size={20} />
                    </button>
                    <button 
                      onClick={() => shareProduct('copy')}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto bg-gray-50">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'description' 
                    ? 'text-primary bg-white border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-8 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'specifications' 
                    ? 'text-primary bg-white border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'reviews' 
                    ? 'text-primary bg-white border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </button>
            </div>
            
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {product.description || 'This high-quality solar product is designed to provide maximum efficiency and reliability for your energy needs.'}
                    </p>
                  </div>
                  
                  {/* Product Images Gallery */}
                  {productImages.length > 1 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-4">Product Gallery</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productImages.map((img, index) => (
                          <div key={index} className="relative h-48 border border-gray-200 rounded-lg overflow-hidden group">
                            <img 
                              src={img} 
                              alt={`${product.title} - Image ${index + 1}`} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                              onClick={() => setSelectedImage(index)}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold mb-4">Features & Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-start bg-green-50 p-4 rounded-lg">
                            <Check size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Why Choose Solar */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                    <h4 className="text-xl font-semibold mb-3 text-gray-900">
                      Why Choose {companyConfig.name ? `${companyConfig.name} Solar Solutions` : 'Solar Energy'}?
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Solar energy is a clean, renewable resource that can help reduce your carbon footprint and save on electricity bills. 
                      Our solar products are designed to harness this abundant energy source efficiently and reliably.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      By investing in solar technology with {companyConfig.name || 'us'}, you're not just purchasing a product – you're making a commitment to 
                      sustainable living and energy independence.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="space-y-8">
                      {/* Main Specifications Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(product.specifications)
                          .filter(([key, value]) => 
                            !['description', 'features', 'images', 'reviews', '_id', '__v'].includes(key) && 
                            value !== null && 
                            value !== undefined && 
                            value !== ''
                          )
                          .map(([key, value]) => {
                            // Format the key name
                            const formattedKey = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase())
                              .replace(/([a-z])([A-Z])/g, '$1 $2')
                              .trim();
                            
                            // Format the value based on key type
                            let formattedValue = value;
                            if (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost')) {
                              formattedValue = formatPrice(value);
                            } else if (key.toLowerCase().includes('efficiency') && typeof value === 'number') {
                              formattedValue = `${value}%`;
                            } else if (key.toLowerCase().includes('power') && typeof value === 'number') {
                              formattedValue = `${value}W`;
                            } else if (key.toLowerCase().includes('voltage') && typeof value === 'number') {
                              formattedValue = `${value}V`;
                            } else if (key.toLowerCase().includes('current') && typeof value === 'number') {
                              formattedValue = `${value}A`;
                            } else if (key.toLowerCase().includes('temperature') && typeof value === 'number') {
                              formattedValue = `${value}°C`;
                            } else if (key.toLowerCase().includes('dimension') || key.toLowerCase().includes('size')) {
                              formattedValue = typeof value === 'string' ? value : `${value}mm`;
                            } else if (key.toLowerCase().includes('weight') && typeof value === 'number') {
                              formattedValue = `${value}kg`;
                            }
                            
                            return (
                              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                    {formattedKey}
                                  </span>
                                  <span className="text-gray-900 font-medium text-right ml-4">
                                    {formattedValue}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                      
                      {/* Additional Product Info */}
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Shield className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-gray-700">
                              Warranty: {product.specifications?.warranty || '25 Years'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-gray-700">
                              Certified: {product.specifications?.certification || 'IEC Standards'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="w-5 h-5 text-orange-600 mr-2" />
                            <span className="text-gray-700">
                              Installation: {product.specifications?.installation || 'Professional Required'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Info size={64} className="text-gray-300 mx-auto mb-6" />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">Specifications Coming Soon</h4>
                      <p className="text-gray-500 text-lg mb-6">
                        Detailed technical specifications for this product will be available shortly.
                      </p>
                      <button 
                         onClick={() => setIsModalOpen(true)}
                         className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                       >
                         Request Detailed Specs
                       </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
                    </h3>
                    <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                      Write a Review
                    </button>
                  </div>
                  
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-gray-900">{review.customerName || 'Anonymous'}</h5>
                              <div className="flex text-yellow-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                      <p className="text-gray-400">Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
              
              {relatedLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link 
                      key={relatedProduct._id} 
                      to={`/products/product-detail/${relatedProduct._id}`}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={relatedProduct.images && relatedProduct.images.length > 0 
                            ? (relatedProduct.images[0].startsWith('/uploads/') 
                                ? relatedProduct.images[0] 
                                : `/uploads/${relatedProduct.images[0]}`)
                            : '/placeholder-product.png'
                          }
                          alt={relatedProduct.title} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                        
                        {/* Product tags */}
                        {relatedProduct.status && relatedProduct.status.length > 0 && (
                          <div className="absolute top-2 left-2">
                            {relatedProduct.status.slice(0, 1).map((tag, i) => (
                              <span
                                key={i}
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  tag === 'Sale'
                                    ? 'bg-red-500 text-white'
                                    : tag === 'New'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-800 text-white'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedProduct.title}
                        </h4>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < (relatedProduct.averageRating || relatedProduct.rating || 0) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({relatedProduct.reviewCount || 0})
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {relatedProduct.oldPrice && (
                            <p className="text-sm line-through text-gray-400">{formatPrice(relatedProduct.oldPrice)}</p>
                          )}
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(relatedProduct.newPrice || relatedProduct.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Request Quote Modal */}
      {isModalOpen && (
        <RequestQuoteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          product={product}
          quantity={quantity}
        />
      )}
    </div>
  );
};

export default ProductDetail;