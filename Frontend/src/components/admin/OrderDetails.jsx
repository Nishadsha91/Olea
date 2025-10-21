import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft,FiMail,FiCheckCircle,FiTruck,FiPackage,FiXCircle,FiClock,FiUser,FiPhone,FiMapPin,FiShoppingBag} from 'react-icons/fi';
import Layout from './Layout';
import { IndianRupeeIcon } from 'lucide-react';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const orderResponse = await axios.get(`http://localhost:3000/orders/${orderId}`);
        setOrder(orderResponse.data);
        // Fetch customer details if userId exists
        if (orderResponse.data.userId) {
          try {
            const customerResponse = await axios.get(`http://localhost:3000/users/${orderResponse.data.userId}`);
            setCustomer(customerResponse.data);
          } catch (customerError) {
            console.warn("Could not fetch customer details", customerError);
          }
        }
      } catch (err) {
        console.error("Error fetching order details", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-amber-500" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}`, {
        status: newStatus
      });
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating order status", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <FiShoppingBag className="w-6 h-6 text-purple-600 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Order Details</h3>
            <p className="text-gray-600">Please wait while we fetch the order information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-gray-600 mb-6">The requested order could not be found.</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id || order.orderId}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.date || order.createdAt)}
            </p>
          </div>
         
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900">
                          <IndianRupeeIcon className="inline w-4 h-4" /> {item.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      <IndianRupeeIcon className="inline w-4 h-4" /> {order.subtotal?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      <IndianRupeeIcon className="inline w-4 h-4" /> {order.shipping?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      <IndianRupeeIcon className="inline w-4 h-4" /> {order.tax?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      <IndianRupeeIcon className="inline w-4 h-4" /> {order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <address className="not-italic text-gray-600 space-y-1">
                    <div className="flex items-start gap-2">
                      <FiUser className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>{order.shippingAddress?.name || customer?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>
                        {order.shippingAddress?.street && `${order.shippingAddress.street}, `}
                        {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                        {order.shippingAddress?.state && `${order.shippingAddress.state} - `}
                        {order.shippingAddress?.zip && `${order.shippingAddress.zip}, `}
                        {order.shippingAddress?.country || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiPhone className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>{order.shippingAddress?.phone || customer?.phone || 'N/A'}</span>
                    </div>
                  </address>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Method</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiTruck className="w-5 h-5 text-gray-400" />
                    <span>{order.shippingMethod || 'Standard Shipping'}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Tracking Number</h4>
                      <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                      {order.trackingUrl && (
                        <a 
                          href={order.trackingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-1 text-sm text-purple-600 hover:underline"
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-purple-600">
                    {customer?.name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {customer?.name || order.shippingAddress?.name || 'Guest Customer'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {customer?.email || order.shippingAddress?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <span>Customer since: {customer?.createdAt ? new Date(customer.createdAt).getFullYear() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiShoppingBag className="w-4 h-4 text-gray-400" />
                  <span>Total orders: {customer?.orders?.length || 1}</span>
                </div>
                <button className="flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-800 transition-colors">
                  <FiMail className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateStatus('Processing')}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    order.status === 'Processing' 
                      ? 'bg-amber-50 border-amber-200 text-amber-800' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiPackage className="w-5 h-5" />
                    <span>Mark as Processing</span>
                  </div>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Shipped')}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    order.status === 'Shipped' 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiTruck className="w-5 h-5" />
                    <span>Mark as Shipped</span>
                  </div>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Delivered')}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    order.status === 'Delivered' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5" />
                    <span>Mark as Delivered</span>
                  </div>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Cancelled')}
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    order.status === 'Cancelled' 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiXCircle className="w-5 h-5" />
                    <span>Cancel Order</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetails;