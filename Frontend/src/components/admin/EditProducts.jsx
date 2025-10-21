import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/products/${id}`, {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      });
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full px-4 py-2 border rounded"
            value={product.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full px-4 py-2 border rounded"
            value={product.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full px-4 py-2 border rounded"
            value={product.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="w-full px-4 py-2 border rounded"
            value={product.stock}
            onChange={handleChange}
            required
          />
          <div className='flex gap-4'>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Product
          </button>
           <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            </div>
        </form>
      </div>
    </Layout>
  );
}

export default EditProduct;
