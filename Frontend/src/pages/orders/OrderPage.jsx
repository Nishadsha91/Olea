import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, CheckCircle, Clock, XCircle, ShoppingBag, Home, Star, Package, Calendar, CreditCard, Eye, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig'; // Use your axios instance

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.orderDetails) {
      setOrders(prev => [location.state.orderDetails, ...prev]);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get('/orders/');
        
        const transformedOrders = res.data.map(order => ({
          orderId: order.order_id,
          id: order.id,
          date: order.created_at,
          status: order.status || 'processing',
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          totalAmount: parseFloat(order.total_amount),
          subtotal: parseFloat(order.subtotal),
          shipping: parseFloat(order.shipping),
          items: order.items ? order.items.map(item => ({
            id: item.id,
            name: item.product?.name || 'Product',
            price: parseFloat(item.price || item.product?.price || 0),
            quantity: item.quantity,
            image: item.product?.image || '/placeholder-image.jpg'
          })) : []
        }));
        
        setOrders(transformedOrders.reverse()); 
      } catch (err) {
        console.error('Failed to fetch orders', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProgressWidth = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '25%';
      case 'processing':
        return '50%';
      case 'shipped':
        return '75%';
      case 'delivered':
        return '100%';
      default:
        return '0%';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Orders</h3>
        <p className="text-gray-600">Please wait while we fetch your order history...</p>
      </div>
    </div>
  );

  if (!orders.length) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8 relative">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute -top-20 -right-2 w-12 h-12 bg-yellow-200 rounded-full animate-bounce opacity-70"></div>
          <div className="relative -top-10 -right-2 w-12 h-12 bg-yellow-200 rounded-full animate-bounce opacity-50"></div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">Start your shopping journey with us! Discover amazing products and exclusive deals.</p>
        <button 
          onClick={() => navigate('/products')}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          <span className="flex items-center font-semibold">
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Start Shopping
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Order History
                </h1>
                <p className="text-gray-600 mt-1">Track and manage your purchases</p>
              </div>
            </div>
            <button className="flex items-center text-purple-600 hover:text-purple-800 transition-colors group">
              <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              <Link to='/' className="hidden sm:inline font-medium">Back Home</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">
              {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
            </h3>
            <p className="text-gray-600">Delivered</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">
              {orders.filter(o => o.status?.toLowerCase() === 'shipped').length}
            </h3>
            <p className="text-gray-600">Shipped</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">
              {orders.filter(o => o.status?.toLowerCase() === 'processing' || o.status?.toLowerCase() === 'pending').length}
            </h3>
            <p className="text-gray-600">Processing</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">
              {orders.filter(o => o.status?.toLowerCase() === 'cancelled').length}
            </h3>
            <p className="text-gray-600">Cancelled</p>
          </div>
        </div>

        {/* Orders */}
        <div className="grid gap-8">
          {orders.map((order, index) => (
            <div 
              key={order.orderId || order.id} 
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 transform hover:scale-[1.02]"
            >
              {/* Order Header */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          #{order.orderId ? order.orderId.slice(-3) : order.id}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Order {order.orderId || `#${order.id}`}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.date || order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {order.paymentMethod || 'Cash'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 flex flex-col items-end">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status || 'Pending'}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status?.toLowerCase() !== 'cancelled' && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Order Placed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: getProgressWidth(order.status) }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Items Preview */}
                <div className="space-y-4">
                  {order.items?.slice(0, expandedOrder === order.orderId ? order.items.length : 2).map((item, itemIndex) => (
                    <div key={item.id || itemIndex} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {order.items?.length > 2 && (
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                      className="w-full flex items-center justify-center space-x-2 py-3 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>
                        {expandedOrder === order.orderId 
                          ? 'Show Less' 
                          : `View ${order.items.length - 2} More Items`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;