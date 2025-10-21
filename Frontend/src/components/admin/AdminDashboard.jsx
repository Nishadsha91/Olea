import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from 'recharts';
import {Package, ShoppingCart, Users, TrendingUp,IndianRupee, Eye,} from 'lucide-react';
import Layout from './Layout';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

function AdminDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
  const fetchData = async () => {

    try {
      const [ordersTotal, usersTotal, productsTotal] = await Promise.all([
        axios.get('http://localhost:3000/orders'),
        axios.get('http://localhost:3000/users'),
        axios.get('http://localhost:3000/products')
      ]);

      const orders = ordersTotal.data || [];
      const users = usersTotal.data || [];
      const products = productsTotal.data || [];
      const dataByDate = {};
      const categoryCount = {};
      let total = 0;

      orders.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        const orderTotal = order.totalAmount|| 0;
        dataByDate[date] = (dataByDate[date] || 0) + orderTotal;
        total += orderTotal;
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity;
          });
        }
      });

      setSalesData(Object.entries(dataByDate).map(([date, total]) => ({ date, total })));
      setCategoryData(Object.entries(categoryCount).map(([category, value]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value
      })));
      setTotalRevenue(total);
      setOrders(orders);
      setUsers(users);
      setProducts(products);
      setRecentActivity(orders.slice(-4).reverse().map((order, index) => ({
        id: index + 1,
        type: 'order',
        message: `New order from ${order.user || 'Customer'}`,
        time: new Date(order.date).toLocaleTimeString(),
        amount: `₹${order.totalAmount || 0}`
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  fetchData();
}, []);

  const stats = {
    totalRevenue,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalProducts: products.length,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    usersGrowth: 15.3,
    productsGrowth: 5.1
  };

  return (
    <Layout>
      
      
        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +{stats.revenueGrowth}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <IndianRupee size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +{stats.ordersGrowth}% from last month
                  </p>
               
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +{stats.usersGrowth}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts.toLocaleString()}</p>
                  <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    +{stats.productsGrowth}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Package size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-xl/30 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'order' ? 'bg-green-100' : 
                      activity.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'order' ? <ShoppingCart size={18} className="text-green-600" /> :
                       activity.type === 'user' ? <Users size={18} className="text-blue-600" /> :
                       <Package size={18} className="text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <div className="text-sm font-semibold text-green-600">
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Categories Sold</p>
                    <p className="text-xl font-bold text-gray-900">{categoryData.length}</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Sales Days</p>
                    <p className="text-xl font-bold text-gray-900">{salesData.length} days</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Eye size={16} className="text-white" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-xl font-bold text-gray-900">₹{orders.length > 0 ? Math.round(totalRevenue/ orders.length) : 0}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}

export default AdminDashboard;
