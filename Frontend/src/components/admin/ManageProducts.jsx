import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter ,FiChevronLeft, FiChevronRight  } from 'react-icons/fi';

import axiosInstance from '../../api/axiosConfig';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/manage-products/?page=${page}`);

      setProducts(res.data.results || []);
      setTotalProducts(res.data.count || 0);

      const pageSize = 10;
      setTotalPages(Math.ceil((res.data.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to load products. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosInstance.delete(`/manage-products/${id}/`);
      fetchProducts(page); 
    } catch (err) {
      alert('Failed to delete product. Please try again.');
    }
  };

  // Filter & search
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="p-4 max-w-7xl mx-auto text-center py-8">Loading products...</div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="p-4 max-w-7xl mx-auto text-center py-8 text-red-600">{error}</div>
        <div className="text-center">
          <button
            onClick={() => fetchProducts(page)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">Product List</h1>
            <p className="text-gray-600 mt-1">Manage all your products in one place</p>
          </div>
          <button
            onClick={() => navigate('/admin/addproducts')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 mt-4 md:mt-0"
          >
            <FiPlus size={16} />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Product name or category..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} of {totalProducts} products
              </span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-xl/30 border border-gray-300 overflow-hidden">
          
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-100">
            <div className="col-span-3 font-medium text-gray-700">Product</div>
            <div className="col-span-2 font-medium text-gray-700">Category</div>
            <div className="col-span-2 font-medium text-gray-700">Price</div>
            <div className="col-span-2 font-medium text-gray-700">Stock</div>
            <div className="col-span-3 font-medium text-gray-700 text-right">Actions</div>
          </div>

          {/* Product Rows */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 flex items-center font-medium text-gray-800">{product.name}</div>
                <div className="col-span-2 flex items-center text-gray-600">
                  {product.category || 'Uncategorized'}
                </div>
                <div className="col-span-2 flex items-center font-medium">₹{product.price}</div>
                <div className="col-span-2 flex items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="col-span-3 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/admin/editproduct/${product.id}`)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50 transition"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1.5 rounded hover:bg-red-50 transition"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {products.length === 0
                ? 'No products found'
                : 'No products match your criteria'}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
       <div className="flex justify-center items-center mt-6 space-x-6">

          <button
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronLeft size={20} className="text-gray-700" />
          </button>        
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronRight size={20} className="text-gray-700" />
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default ManageProducts;
