import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      try {
        // Fetch order by ID
        const orderRes = await axios.get(`http://localhost:3000/orders/${id}`);
        const orderData = orderRes.data;
        setOrder(orderData);
        setStatus(orderData.status);

        // Fetch user using order.userId
        const userRes = await axios.get(`http://localhost:3000/users/${orderData.userId}`);
        setCustomerName(userRes.data.name);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchOrderAndUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/orders/${id}`, {
        ...order,
        status: status
      });
      navigate('/admin/orders');
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Update Order #{order.id}</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Customer</label>
            <input
              type="text"
              value={customerName}
              readOnly
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Total</label>
            <input
              type="text"
              value={`₹${order.total}`}
              readOnly
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Status
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default UpdateOrder;
