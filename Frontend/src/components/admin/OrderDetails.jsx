import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiArrowLeft, FiMail, FiCheckCircle, FiTruck, FiPackage, FiXCircle, 
  FiClock, FiUser, FiPhone, FiShoppingBag 
} from 'react-icons/fi';
import { IndianRupee } from 'lucide-react';
import Layout from './Layout';
import axiosInstance from '../../api/axiosConfig';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const orderResponse = await axiosInstance.get(`/manage-orders/${orderId}/`);
        const orderData = orderResponse.data;
        console.log("Order API Response:", orderData);
        setOrder(orderData);

      } catch (err) {
        console.error("Error fetching order details", err);
        console.error("Error details:", err.response?.data);
        setError(err.response?.data?.message || err.response?.data?.error || "Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <FiCheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'shipped': return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'processing': return <FiPackage className="w-5 h-5 text-amber-500" />;
      case 'cancelled': return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <FiClock className="w-5 h-5 text-orange-500" />;
      default: return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'processing': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      return;
    }

    try {
      const response = await axiosInstance.patch(`/manage-orders/${orderId}`, { 
        status: newStatus.toLowerCase() 
      });
      
      setOrder(prev => ({ ...prev, status: newStatus.toLowerCase() }));
      alert(`Order status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error("Error updating order status", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Helper function to get customer info from order
  const getCustomerInfo = () => {
    if (!order || !order.user) return { name: 'Guest Customer', email: 'N/A', phone: 'N/A' };
    
    if (typeof order.user === 'object') {
      return {
        name: order.user.username || 'Unknown Customer',
        email: order.user.email || 'N/A',
        phone: order.user.phone || 'N/A'
      };
    }
    
    return {
      name: order.user || 'Guest Customer',
      email: 'N/A',
      phone: 'N/A'
    };
  };

  // Calculate item total for display
  const calculateItemTotal = (item) => {
    return (item.quantity * item.price).toLocaleString();
  };

  if (loading) return (
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

  if (error || !order) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">{error || "The requested order could not be found."}</p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}<br />
            Check if the order exists and you have proper permissions.
          </p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    </Layout>
  );

  const customer = getCustomerInfo();
  const orderItems = order.items || [];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.order_id}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                <span className="capitalize">{order.payment_status}</span>
              </span>
            </div>
            <p className="text-gray-600 mt-1">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.product?.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: item.product?.image ? 'none' : 'flex' }}>
                          <FiShoppingBag className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.product?.category || 'N/A'}</p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{item.price?.toLocaleString()}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            Total: ₹{calculateItemTotal(item)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items found in this order</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{order.subtotal?.toLocaleString() || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ₹{order.shipping?.toLocaleString() || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">
                      ₹{order.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{order.payment_method || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status || 'N/A'}
                      </span>
                    </div>
                    {order.razorpay_payment_id && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Razorpay Payment ID</p>
                        <p className="font-medium text-sm break-all">{order.razorpay_payment_id}</p>
                      </div>
                    )}
                    {order.razorpay_order_id && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Razorpay Order ID</p>
                        <p className="font-medium text-sm break-all">{order.razorpay_order_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information & Actions */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-medium text-purple-600">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{customer.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{order.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Database ID</p>
                  <p className="font-medium text-sm">{order.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetails;