import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Upload,
  Save,
  X,
  Calendar,
  Tag,
  User,
  BarChart3
} from 'lucide-react';

const BlogCMS = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'general',
    author: { name: 'Cosmic Solar Team', email: 'info@cosmicsolar.com' },
    status: 'draft',
    metaTitle: '',
    metaDescription: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['general', 'news', 'technology', 'sustainability', 'solar', 'renewable'];
  const statuses = ['draft', 'published', 'archived'];

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        category: categoryFilter,
        search: searchTerm
      };
      
      const response = await blogService.getAllBlogs(params);
      
      if (response.success) {
        setBlogs(response.data);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      alert('Error fetching blogs: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await blogService.getBlogStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  // Handle editingBlog changes to update form
  useEffect(() => {
    if (editingBlog) {
      const newFormData = {
        title: editingBlog.title || '',
        excerpt: editingBlog.excerpt || '',
        content: editingBlog.content || '',
        featuredImage: editingBlog.featuredImage || '',
        category: editingBlog.category || 'general',
        author: editingBlog.author || { name: 'Cosmic Solar Team', email: 'info@cosmicsolar.com' },
        status: editingBlog.status || 'draft',
        metaTitle: editingBlog.metaTitle || '',
        metaDescription: editingBlog.metaDescription || ''
      };
      
      setFormData(newFormData);
      setImagePreview(editingBlog.featuredImage || '');
    }
  }, [editingBlog]);



  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      const response = await blogService.uploadImage(file);
      
      if (response.success) {
        return response.data.imageUrl;
      }
    } catch (error) {
      alert('Error uploading image: ' + (error.response?.data?.message || error.message));
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = formData.featuredImage;
      
      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }
      
      // Validate required fields
      if (!imageUrl && !editingBlog) {
        alert('Please select a featured image');
        setLoading(false);
        return;
      }
      
      const blogData = {
        ...formData,
        featuredImage: imageUrl
      };
      
      // Add image file only if new file is selected
      if (imageFile) {
        blogData.featuredImageFile = imageFile;
      } else if (editingBlog && !imageFile) {
        // For updates without new image file, don't include featuredImageFile
        // The existing featuredImage URL will be used
        delete blogData.featuredImageFile;
      }
      
      let response;
      if (editingBlog) {
        response = await blogService.updateBlog(editingBlog._id, blogData);
      } else {
        response = await blogService.createBlog(blogData);
      }
      
      if (response.success) {
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowModal(false);
        resetForm();
        fetchBlogs();
        fetchStats();
      }
    } catch (error) {
      alert('Error saving blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const response = await blogService.deleteBlog(id);
      if (response.success) {
        alert('Blog deleted successfully!');
        fetchBlogs();
        fetchStats();
      }
    } catch (error) {
      alert('Error deleting blog: ' + (error.response?.data?.message || error.message));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: 'general',
      author: { name: 'Cosmic Solar Team', email: 'info@cosmicsolar.com' },
      status: 'draft',
      metaTitle: '',
      metaDescription: ''
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBlog(null);
  };

  // Handle edit
  const handleEdit = async (blog) => {
    try {
      // Fetch complete blog data including content and tags
      const response = await blogService.getBlog(blog._id);
      if (response.success) {
        setEditingBlog(response.data);
      } else {
        setEditingBlog(blog);
      }
    } catch (error) {
      setEditingBlog(blog);
    }
    
    setShowModal(true);
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>

        </div>
        <p className="text-gray-600">Create, edit, and manage your blog posts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Edit className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
            </div>
            <Trash2 className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Add New Button */}
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Blog
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No blogs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                          src={blog.featuredImage || '/placeholder-image.jpg'}
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' :
                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog title"
                  />
                </div>
                
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog excerpt"
                  />
                </div>
                
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog content"
                  />
                </div>
                
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                

                
                {/* Meta Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO meta title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO meta description"
                    />
                  </div>
                </div>
                
                {/* Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        author: { ...prev.author, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Author name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Email
                    </label>
                    <input
                      type="email"
                      value={formData.author.email}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        author: { ...prev.author, email: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Author email"
                    />
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCMS;