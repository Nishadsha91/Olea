import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiUserX, FiUserCheck, FiSearch, FiFilter } from 'react-icons/fi';
import UserDetailsModal from '../reusable/UserDetailsModal';




export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("Error fetching users", error));
  };

  const fetchUserOrders = (userId) => {
    setIsLoadingOrders(true);
    axios.get(`http://localhost:3000/orders?userId=${userId}`)
      .then((res) => {
        setUserOrders(res.data);
        setIsLoadingOrders(false);
      })
      .catch((error) => {
        console.error("Error fetching orders", error);
        setIsLoadingOrders(false);
      });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user.id);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserOrders([]);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:3000/users/${id}`)
        .then(() => {
          setUsers(prev => prev.filter(user => user.id !== id));
        })
        .catch(error => console.error("Delete failed", error));
    }
  };

  const handleBlockUnblock = (user, e) => {
    e.stopPropagation();
    const updatedStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    axios.patch(`http://localhost:3000/users/${user.id}`, { status: updatedStatus })
      .then(() => {
        setUsers(prev =>
          prev.map(u =>
            u.id === user.id ? { ...u, status: updatedStatus } : u
          )
        );
      })
      .catch(error => console.error("Status update failed", error));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleOptions = ['All', ...new Set(users.map(user => user.role))];
  const statusOptions = ['All', 'Active', 'Inactive'];

  return (
    <Layout>
      <div className="p-2 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl -mt-2 font-bold text-gray-900 flex items-center">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-xl/30 inset-shadow-sm border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="py-3 px-6 font-medium text-gray-700">User</th>
                  <th className="py-3 px-6 font-medium text-gray-700">Email</th>
                  <th className="py-3 px-6 font-medium text-gray-700">Role</th>
                  <th className="py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="py-3 px-6 font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/edituser/${user.id}`);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleBlockUnblock(user, e)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'Active' 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.status === 'Active' ? 'Block' : 'Unblock'}
                        >
                          {user.status === 'Active' ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                        </button>
                        <button
                          onClick={(e) => handleDelete(user.id, e)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No users match your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
       {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          orders={userOrders} 
          onClose={handleCloseModal} 
        />
      )}
      </div>
    </Layout>
  );
}