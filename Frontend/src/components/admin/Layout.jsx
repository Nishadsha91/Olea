import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronDown, 
  User, 
  Settings, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';
import axios from 'axios';
import axiosInstance from '../../api/axiosConfig';

function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "",
    role: "Admin"
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosInstance.get('/users/');
        const adminUsers = response.data.filter(user => user.role === 'admin');
        
        if (adminUsers.length > 0) {
          const admin = adminUsers[0];
          setAdminData({
            name: admin.name || "Admin",
            email: admin.email || "admin@example.com",
            role: admin.role || "Administrator"
          });
        } else {
          // Fallback if no admin found
          setAdminData({
            name: "Admin User",
            email: "admin@example.com",
            role: "Administrator"
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // Fallback data if API fails
        setAdminData({
          name: "Admin User",
          email: "admin@example.com",
          role: "Administrator"
        });
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Olea Store
            </h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg ${
                isActive ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg ${
                isActive ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package size={20} />
              Products
            </NavLink>
            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg ${
                isActive ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart size={20} />
              Orders
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg ${
                isActive ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              Users
            </NavLink>
          </nav>

          
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">📈Admin Panel</h1>
              
            </div>
            <div className="flex items-center gap-4">
              
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {adminData?.name?.charAt(0) || 'A'}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3 bg-gray-100">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {adminData?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{adminData.name}</p>
                          <p className="text-sm text-gray-500">{adminData.email}</p>
                          <p className="text-xs text-purple-600 mt-1">{adminData.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 border-t border-gray-200">
                      <button 
                        onClick={() => {
                          navigate('/login');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

       
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}

export default Layout;