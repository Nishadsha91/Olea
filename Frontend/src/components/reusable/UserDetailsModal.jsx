import { FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiCreditCard } from 'react-icons/fi';

// User Details Modal Component
const UserDetailsModal = ({ user, orders, onClose }) => {
  if (!user) return null;

  // Calculate order statistics
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="fixed inset-0 bg-gray-300 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}'s Profile</h2>
              <p className="text-gray-600">User ID: {user.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg col-span-1">
              <h3 className="font-medium text-lg mb-4 text-gray-800 flex items-center gap-2">
                <FiUser className="text-gray-500" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">@{user.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiCalendar size={14} />
                    {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{user.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg col-span-1">
              <h3 className="font-medium text-lg mb-4 text-gray-800 flex items-center gap-2">
                <FiMail className="text-gray-500" /> Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiMail size={14} />
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {user.emailVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiPhone size={14} />
                    {user.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiMapPin size={14} />
                    {user.address ? `${user.address.street}, ${user.address.city}` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg col-span-1">
              <h3 className="font-medium text-lg mb-4 text-gray-800 flex items-center gap-2">
                <FiCreditCard className="text-gray-500" /> Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className={`font-medium ${
                    user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="font-medium">
                    {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status.toLowerCase() === 'delivered').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(order => order.status.toLowerCase() === 'processing').length} </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-gray-800">Order History</h3>
            {orders.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Order ID</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Items</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Total</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">#{order.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {order.items.length} items
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <p className="text-gray-500">No orders found for this user</p>
              </div>
            )}
          </div>

         
         
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;