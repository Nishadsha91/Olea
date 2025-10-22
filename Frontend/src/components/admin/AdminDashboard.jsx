import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, IndianRupee, Eye, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import Layout from './Layout';
import axiosInstance from '../../api/axiosConfig';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    salesData: [],
    categoryData: [],
    totalRevenue: 0,
    orders: [],
    users: [],
    products: [],
    recentActivity: []
  });
  const [timeRange, setTimeRange] = useState('month'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (range = timeRange) => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await axiosInstance.get(`/admin-dashboard/?range=${range}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      // setDashboardData(getFallbackData()); // Uncomment if fallback is needed
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    fetchDashboardData(newRange);
  };

  const handleRefresh = () => fetchDashboardData();

  const { salesData, categoryData, totalRevenue, orders, users, products, recentActivity } = dashboardData;

  const stats = {
    totalRevenue,
    totalOrders: orders?.length || 0,
    totalUsers: users?.length || 0,
    totalProducts: products?.length || 0,
  };

  const formatCurrency = (value) => `₹${value?.toLocaleString()}`;
  const formatYAxis = (value) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <TrendingUp className="w-6 h-6 text-purple-600 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h3>
            <p className="text-gray-600">Please wait while we load your analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !dashboardData.salesData.length) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Real-time analytics and performance metrics</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<IndianRupee size={24} className="text-white" />} gradient="from-green-500 to-emerald-500" trendColor="text-green-600" loading={refreshing} />
          <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={<ShoppingCart size={24} className="text-white" />} gradient="from-blue-500 to-cyan-500" trendColor="text-blue-600" loading={refreshing} />
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<Users size={24} className="text-white" />} gradient="from-purple-500 to-pink-500" trendColor="text-purple-600" loading={refreshing} />
          <StatCard title="Total Products" value={stats.totalProducts.toLocaleString()} icon={<Package size={24} className="text-white" />} gradient="from-orange-500 to-red-500" trendColor="text-orange-600" loading={refreshing} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl/30 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {timeRange === 'week' && 'Last 7 days'}
                  {timeRange === 'month' && 'Last 30 days'}
                  {timeRange === 'year' && 'Last 12 months'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['week', 'month', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === range ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatYAxis} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} labelFormatter={(label) => `Date: ${label}`} contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px' }} />
                <Area type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={3} fill="url(#colorRevenue)" dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#8B5CF6', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">By Revenue</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActivityList activities={recentActivity} loading={refreshing} />
          <QuickStats categoryData={categoryData} salesData={salesData} orders={orders} totalRevenue={totalRevenue} loading={refreshing} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 transition-colors">×</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;

/* ----------------------- Helper Components ----------------------- */

const StatCard = ({ title, value, growth, icon, gradient, trendColor, loading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? <div className="h-8 bg-gray-200 rounded animate-pulse mt-1 w-24"></div> : <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>}
      </div>
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>{icon}</div>
    </div>
  </div>
);

const ActivityList = ({ activities, loading }) => (
  <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <span className="text-sm text-gray-500">{activities?.length || 0} activities</span>
    </div>
    <div className="space-y-4">
      {loading ? Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )) : activities?.length > 0 ? activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'order' ? 'bg-green-100' : activity.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
            {activity.type === 'order' ? <ShoppingCart size={18} className="text-green-600" /> : activity.type === 'user' ? <Users size={18} className="text-blue-600" /> : <Package size={18} className="text-purple-600" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          {activity.amount && <div className="text-sm font-semibold text-green-600 whitespace-nowrap">{activity.amount}</div>}
        </div>
      )) : (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  </div>
);

const QuickStats = ({ categoryData, salesData, orders, totalRevenue, loading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-xl/20 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
    <div className="space-y-4">
      <StatBox label="Categories Sold" value={categoryData?.length || 0} color="from-purple-50 to-pink-50" iconColor="bg-purple-500" loading={loading} />
      <StatBox label="Sales Period" value={`${salesData?.length || 0} ${salesData?.length === 1 ? 'day' : 'days'}`} color="from-blue-50 to-cyan-50" iconColor="bg-blue-500" icon={<Eye size={16} className="text-white" />} loading={loading} />
      <StatBox label="Avg Order Value" value={`₹${orders?.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}`} color="from-green-50 to-emerald-50" iconColor="bg-green-500" loading={loading} />
      <StatBox label="Conversion Rate" value={`${orders?.length && orders.length > 0 ? '12.5%' : '0%'}`} color="from-orange-50 to-amber-50" iconColor="bg-orange-500" loading={loading} />
    </div>
  </div>
);

const StatBox = ({ label, value, color, iconColor, icon, loading }) => (
  <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${color} rounded-xl hover:shadow-sm transition-shadow`}>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {loading ? <div className="h-6 bg-gray-300 rounded animate-pulse mt-1 w-16"></div> : <p className="text-xl font-bold text-gray-900">{value}</p>}
    </div>
    <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center flex-shrink-0`}>{icon || <TrendingUp size={16} className="text-white" />}</div>
  </div>
);
