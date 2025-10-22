import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ageOptions = [
  { id: '0-6', label: '0-6 months' },
  { id: '6-12', label: '6-12 months' },
  { id: '1-2', label: '1-2 years' },
  { id: '2-3', label: '2-3 years' },
  { id: 'all', label: 'All Ages' },
  ];

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '', 
    age_range:'all'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then(res => {
        setProduct({
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          stock: res.data.stock,
          description: res.data.description || '',
          image: null,
          age_range: res.data.age_range || 'all',
        });
        setImagePreview(res.data.image); // show existing image
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setProduct(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', product.name.trim());
    formData.append('category', product.category.toLowerCase());
    formData.append('price', parseFloat(product.price));
    formData.append('stock', parseInt(product.stock));
    formData.append('description', product.description.trim() || '');
    formData.append('age_range', product.age_range);  
    if (product.image) formData.append('image', product.image);

    await axiosInstance.patch(`/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    navigate('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    alert(error.response?.data || 'Failed to update product.');
  } finally {
    setLoading(false);
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
          <textarea
            name="description"
            placeholder="Description"
            className="w-full px-4 py-2 border rounded"
            value={product.description}
            onChange={handleChange}
            rows={4}
          />

          <div>
            <label className="block mb-1">Age Category</label>
            <select
              name="age_range"
              value={product.age_range}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              {ageOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


          {/* Image Upload */}
          <div>
            <label className="block mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover border rounded"
              />
            )}
          </div>


          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update Product'}
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
