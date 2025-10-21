import React, { useState } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'Boys',
    'Girls',
    'Toys',
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (product.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }
    
    if (!product.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!product.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(product.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (parseFloat(product.price) > 999999) {
      newErrors.price = 'Price cannot exceed 999,999';
    }
    
    if (!product.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (parseInt(product.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    } else if (parseInt(product.stock) > 100000) {
      newErrors.stock = 'Stock cannot exceed 100,000';
    }
    
    if (product.description && product.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: 'Please select a valid image file' });
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image size must be less than 5MB' });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setProduct({ ...product, image: e.target.result });
    };
    reader.readAsDataURL(file);
    
    setErrors({ ...errors, image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccess('');
    
    try {
      const productData = {
        name: product.name.trim(),
        category: product.category,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        description: product.description.trim(),
        image: product.image, 
        createdAt: new Date().toISOString()
      };
      
      await axios.post('http://localhost:3000/products', productData);
      
      setSuccess('Product added successfully!');
      
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.status === 400) {
        setErrors({ general: 'Invalid product data. Please check your inputs.' });
      } else if (error.response?.status === 409) {
        setErrors({ general: 'A product with this name already exists.' });
      } else {
        setErrors({ general: 'Failed to add product. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

 const handleCancel = () => {
  const confirmed = window.confirm('Are you sure? Unsaved changes will be lost.');
  if (confirmed) {
    toast.success('Cancelled successfully');
    navigate('/admin/products');
  }
};


  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded"
          >
            ← Back to Products
          </button>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={product.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              value={product.category}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="999999"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                value={product.price}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                placeholder="0"
                min="0"
                max="100000"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                value={product.stock}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-500 text-sm ml-2">
                ({product.description.length}/500 characters)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter product description (optional)"
              maxLength="500"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              value={product.description}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: JPG, PNG, GIF. Max size: 5MB.
            </p>
            
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddProduct;