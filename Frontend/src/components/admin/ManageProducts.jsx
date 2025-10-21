import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import AdminHead from './AdminHead';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <Layout>
  
      <div className="p-4  max-w-7xl mx-auto">
        {/* Header */}
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl -mt-1 font-bold text-gray-900 flex items-center">Product List</h1>
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
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-end">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} products found
              </span>
            </div>
          </div>
        </div>

        {/* Products List - Line by Line */}
        <div className="bg-white rounded-lg shadow-xl/30 zborder border-gray-300 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-100">
            <div className="col-span-3 font-medium text-gray-700">Product</div>
            <div className="col-span-2 font-medium text-gray-700">Category</div>
            <div className="col-span-2 font-medium text-gray-700">Price</div>
            <div className="col-span-2 font-medium text-gray-700">Stock</div>
            <div className="col-span-3 font-medium text-gray-700 text-right">Actions</div>
          </div>
          
          {/* Product Rows */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 flex items-center">
                  <span className="font-medium text-gray-800">{product.name}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-600">{product.category}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="font-medium">₹{product.price}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
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
              No products match your criteria
            </div>
          )}
        </div>
      </div>
      
    </Layout>
  );
}

export default ManageProducts;