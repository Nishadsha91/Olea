import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiUserX, FiUserCheck, FiSearch, FiFilter, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import UserDetailsModal from '../reusable/UserDetailsModal';
import axiosInstance from '../../api/axiosConfig';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setError(null);
      setRefreshing(true);
      const res = await axiosInstance.get('/users/');
      console.log("Users API Response:", res.data);
      
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid users data format");
      }
      
      const formattedUsers = res.data.map(user => ({
        ...user,
        role: user.is_staff ? 'Admin' : 'User',
        status: user.is_active !== undefined ? (user.is_active ? 'Active' : 'Inactive') : 'Active'
      }));
      console.log("Formatted Users:", formattedUsers); 
      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users", err);
      setError(
        err.response?.data?.message || 
        "Failed to load users. Please check if the server is running and you're authorized."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      let res;
      try {
        res = await axiosInstance.get(`/orders/?user=${userId}`);
      } catch (firstError) {
        console.log("First endpoint failed, trying alternative...");
        res = await axiosInstance.get(`/orders?userId=${userId}`);
      }
      
      console.log(`Orders for user ${userId}:`, res.data);
      
      if (Array.isArray(res.data)) {
        setUserOrders(res.data);
      } else if (res.data.results) {
        setUserOrders(res.data.results);
      } else if (res.data.orders) {
        setUserOrders(res.data.orders); 
      } else {
        setUserOrders([]);
      }
    } catch (err) {
      console.error("Error fetching user orders", err);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user.id);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserOrders([]);
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await axiosInstance.delete(`/users/${userId}/`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (selectedUser && selectedUser.id === userId) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error deleting user", err);
      alert("Failed to delete user. Please try again.");
    }
  };


  const handleBlockUnblock = async (user, e) => {
    e.stopPropagation();
    const isCurrentlyActive = user.status === 'Active';
    const newIsActive = !isCurrentlyActive;

    if (!window.confirm(`Are you sure you want to ${isCurrentlyActive ? 'block' : 'unblock'} this user?`)) return;

    try {
      const res = await axiosInstance.patch(`/block-user/${user.id}/`, {

        is_active: newIsActive
      });

      const updatedUser = {
        ...user,
        is_active: res.data.is_active,
        status: res.data.is_active ? 'Active' : 'Inactive'
      };

      setUsers(prev =>
        prev.map(u => (u.id === user.id ? updatedUser : u))
      );

      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser(updatedUser);
      }

      alert(res.data.message); 
    } catch (err) {
      console.error("Error updating user status", err);
      const errorMsg = err.response?.data?.error || "Failed to update user status. Please try again.";
      alert(errorMsg);
    }
  };


  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const getUserDisplayName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'Unknown User';
  };

  const getUserInitials = (user) => {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  // Filters
  const filteredUsers = users.filter(user => {
    const displayName = getUserDisplayName(user).toLowerCase();
    const email = (user.email || "").toLowerCase();
    
    const matchesSearch =
      displayName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      (user.id?.toString().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'All' || (user.role || 'User') === roleFilter;
    const matchesStatus = statusFilter === 'All' || (user.status || 'Active') === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleOptions = ['All', ...new Set(users.map(u => u.role || 'User').filter(role => role))];
  const statusOptions = ['All', 'Active', 'Inactive'];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered users and their orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or user ID..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </span>
            {(searchQuery || roleFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('All');
                  setStatusFilter('All');
                }}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <FiUserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500">
                {searchQuery || roleFilter !== 'All' || statusFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'No users found in the system'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-600">
                                {getUserInitials(user)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getUserDisplayName(user)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/edituser/${user.id}`); }}
                            className="text-purple-600 hover:text-purple-900 transition-colors p-2 hover:bg-purple-50 rounded-lg"
                            title="Edit User"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleBlockUnblock(user, e)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'Active' 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                          >
                            {user.status === 'Active' ? 
                              <FiUserX className="w-4 h-4" /> : 
                              <FiUserCheck className="w-4 h-4" />
                            }
                          </button>
                          <button
                            onClick={(e) => handleDelete(user.id, e)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal 
            user={selectedUser} 
            orders={userOrders} 
            loading={loadingOrders}
            onClose={handleCloseModal} 
          />
        )}
      </div>
    </Layout>
  );
}