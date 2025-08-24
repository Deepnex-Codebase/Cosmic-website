import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/api';

const ProductCMS = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    newPrice: '',
    oldPrice: '',
    stock: '',
    status: [],
    isActive: true,
    isFeatured: false,
    features: [],
    specifications: {
      brand: '',
      model: '',
      warranty: '',
      efficiency: '',
      dimensions: '',
      weight: '',
      cellType: '',
      powerOutput: '',
      operatingTemperature: '',
      type: '',
      capacity: '',
      mpptChannels: '',
      chemistry: '',
      cycles: '',
      depthOfDischarge: '',
      material: '',
      compatibility: '',
      maxWindLoad: '',
      current: '',
      voltage: '',
      maxPVInput: ''
    }
  });
  const [images, setImages] = useState({
    image: null,
    hoverImage: null,
    additionalImages: []
  });
  const [newFeature, setNewFeature] = useState('');

  // Categories for dropdown (matching Product model enum)
  const categories = [
    'Solar Panels',
    'Inverters',
    'Batteries',
    'Accessories'
  ];

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      
      // Axios returns full response object, we need response.data
      if (response.data && response.data.success && response.data.data) {
        setProducts(response.data.data);
        console.log('Products set:', response.data.data);
      } else {
        console.error('Invalid response structure:', response);
        setProducts([]);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specifications.')) {
      const specKey = name.replace('specifications.', '');
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'additional') {
        setImages(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, file]
        }));
      } else {
        setImages(prev => ({ ...prev, [type]: file }));
      }
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setImages(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      newPrice: '',
      oldPrice: '',
      stock: '',
      status: [],
      isActive: true,
      isFeatured: false,
      features: [],
      specifications: {
        brand: '',
        model: '',
        warranty: '',
        efficiency: '',
        dimensions: '',
        weight: '',
        cellType: '',
        powerOutput: '',
        operatingTemperature: '',
        type: '',
        capacity: '',
        mpptChannels: '',
        chemistry: '',
        cycles: '',
        depthOfDischarge: '',
        material: '',
        compatibility: '',
        maxWindLoad: '',
        current: '',
        voltage: '',
        maxPVInput: ''
      }
    });
    setImages({
      image: null,
      hoverImage: null,
      additionalImages: []
    });
    setNewFeature('');
    setEditingProduct(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!editingProduct && !images.image) {
      toast.error('Please select a main product image');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('newPrice', formData.newPrice);
      formDataToSend.append('oldPrice', formData.oldPrice);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isFeatured', formData.isFeatured);
      
      // Add status array
      formData.status.forEach((statusItem, index) => {
        formDataToSend.append(`status[${index}]`, statusItem);
      });
      
      // Add features
      formData.features.forEach((feature, index) => {
        formDataToSend.append(`features[${index}]`, feature);
      });
      
      // Add specifications with dot notation
      console.log('Frontend - Sending specifications:', formData.specifications);
      Object.keys(formData.specifications).forEach(key => {
        // Send all specification fields, even if empty (for proper updates)
        const value = formData.specifications[key] || '';
        formDataToSend.append(`specifications.${key}`, value);
        console.log(`Frontend - Adding specification: ${key} = ${value}`);
      });
      
      // Add images with folder parameter for proper image path
      if (images.image) {
        formDataToSend.append('image', images.image);
        formDataToSend.append('folder', 'navbar'); // Add folder parameter for main image
      }
      if (images.hoverImage) {
        formDataToSend.append('hoverImage', images.hoverImage);
        formDataToSend.append('folder', 'navbar'); // Add folder parameter for hover image
      }
      images.additionalImages.forEach((img) => {
        formDataToSend.append(`images`, img);
      });
      // Add folder parameter for additional images
      if (images.additionalImages.length > 0) {
        formDataToSend.append('folder', 'navbar');
      }

      console.log('Submitting form data:', formDataToSend);
      
      let response;
      if (editingProduct) {
        response = await productService.updateProduct(editingProduct._id, formDataToSend);
      } else {
        response = await productService.createProduct(formDataToSend);
      }
      
      console.log('Submit response:', response);
       
       // Axios returns full response object, we need response.data
       if (response.data && response.data.success) {
         toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
         resetForm();
         fetchProducts();
         setShowForm(false);
       } else {
         toast.error(response.data?.error || response.data?.message || 'Failed to save product');
       }
    } catch (error) {
      toast.error('An error occurred while saving the product');
      console.error('Error saving product:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    console.log('Editing product:', product);
    console.log('Product specifications:', product.specifications);
    
    setEditingProduct(product);
    
    // Create default specifications structure
    const defaultSpecs = {
      brand: '',
      model: '',
      warranty: '',
      efficiency: '',
      dimensions: '',
      weight: '',
      cellType: '',
      powerOutput: '',
      operatingTemperature: '',
      type: '',
      capacity: '',
      mpptChannels: '',
      chemistry: '',
      cycles: '',
      depthOfDischarge: '',
      material: '',
      compatibility: '',
      maxWindLoad: '',
      current: '',
      voltage: '',
      maxPVInput: ''
    };
    
    // Merge existing specifications with defaults
    const mergedSpecs = {
      ...defaultSpecs,
      ...(product.specifications || {})
    };
    
    setFormData({
      title: product.title || '',
      category: product.category || '',
      description: product.description || '',
      newPrice: product.newPrice || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock || '',
      status: product.status || [],
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
      features: product.features || [],
      specifications: mergedSpecs
    });
    
    console.log('Form data set with specifications:', mergedSpecs);
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const response = await productService.deleteProduct(productId);
        if (response.success) {
          toast.success('Product deleted successfully!');
          fetchProducts();
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the product');
        console.error('Error deleting product:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-2">Manage your solar products inventory</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {showForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Price
                  </label>
                  <input
                    type="number"
                    name="newPrice"
                    value={formData.newPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Old Price
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-4">
                   <div>
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         checked={formData.isActive}
                         onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                         className="mr-2"
                       />
                       <span className="text-sm font-medium text-gray-700">Active</span>
                     </label>
                   </div>
                   <div>
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         checked={formData.isFeatured}
                         onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                         className="mr-2"
                       />
                       <span className="text-sm font-medium text-gray-700">Featured</span>
                     </label>
                   </div>
                 </div>
               </div>
               
               {/* Status Tags */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Status Tags
                 </label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {['Sale', 'New', 'Featured', 'Sold'].map(statusOption => (
                     <label key={statusOption} className="flex items-center">
                       <input
                         type="checkbox"
                         checked={formData.status.includes(statusOption)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setFormData(prev => ({
                               ...prev,
                               status: [...prev.status, statusOption]
                             }));
                           } else {
                             setFormData(prev => ({
                               ...prev,
                               status: prev.status.filter(s => s !== statusOption)
                             }));
                           }
                         }}
                         className="mr-2"
                       />
                       <span className="text-sm text-gray-700">{statusOption}</span>
                     </label>
                   ))}
                 </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image {!editingProduct && '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!editingProduct}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'hoverImage')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      Array.from(e.target.files).forEach(file => {
                        setImages(prev => ({
                          ...prev,
                          additionalImages: [...prev.additionalImages, file]
                        }));
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {images.additionalImages.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {images.additionalImages.map((img, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600">{img.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Features</h3>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(formData.specifications).map(key => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        name={`specifications.${key}`}
                        value={formData.specifications[key]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Products List</h2>
            <p className="text-gray-600 mt-1">Total: {products.length} products</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No products found. Create your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image && (
                            <img
                              src={product.image.startsWith('http') ? 
                                product.image : 
                                (product.image.startsWith('/uploads/') ? 
                                  `https://api.cosmicpowertech.com${product.image}` : 
                                  `https://api.cosmicpowertech.com/uploads/${product.image}`)
                              }
                              alt={product.title}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.newPrice && `₹${product.newPrice}`}
                        {product.oldPrice && (
                          <span className="ml-2 text-gray-500 line-through">₹{product.oldPrice}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="space-y-1">
                           <div className="flex flex-wrap gap-1">
                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                               product.isActive 
                                 ? 'bg-green-100 text-green-800' 
                                 : 'bg-red-100 text-red-800'
                             }`}>
                               {product.isActive ? 'Active' : 'Inactive'}
                             </span>
                             {product.isFeatured && (
                               <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                 Featured
                               </span>
                             )}
                             {product.status && product.status.map((statusTag, index) => (
                               <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                 {statusTag}
                               </span>
                             ))}
                           </div>
                         </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCMS;