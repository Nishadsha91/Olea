import { FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiCreditCard } from 'react-icons/fi';

const UserDetailsModal = ({ user, orders, onClose }) => {
  if (!user) return null;

  const totalSpent = orders.reduce((sum, order) => {
    const amount = parseFloat(order.total_amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.first_name || user.username}'s Profile</h2>
            <p className="text-gray-600 text-sm">User ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<FiUser className="text-gray-500" />}
              title="Personal Information"
              content={[
                { label: 'Full Name', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A' },
                { label: 'Username', value: `@${user.username || 'N/A'}` },
                { label: 'Date of Birth', value: user.dob ? new Date(user.dob).toLocaleDateString() : 'Not specified', icon: <FiCalendar size={14} /> },
                { label: 'Gender', value: user.gender || 'Not specified', capitalize: true },
              ]}
            />

            {/* Contact Information */}
            <InfoCard
              icon={<FiMail className="text-gray-500" />}
              title="Contact Information"
              content={[
                { label: 'Email', value: user.email || 'N/A', icon: <FiMail size={14} />, note: user.email ? (user.emailVerified ? 'Verified' : 'Not verified') : '' },
                { label: 'Phone', value: user.phone || 'Not provided', icon: <FiPhone size={14} /> },
                { label: 'Address', value: user.address ? `${user.address.street}, ${user.address.city}` : 'Not provided', icon: <FiMapPin size={14} /> },
              ]}
            />

            {/* Account Information */}
            <InfoCard
              icon={<FiCreditCard className="text-gray-500" />}
              title="Account Information"
              content={[
                { label: 'Status', value: user.status || 'Inactive', color: user.status === 'Active' ? 'green' : 'red' },
                { label: 'Role', value: user.role || 'User', capitalize: true },
                { label: 'Registered On', value: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A' },
                { label: 'Last Active', value: user.last_login ? new Date(user.last_login).toLocaleString() : 'Unknown' },
              ]}
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Orders" value={orders.length} />
            <StatCard title="Completed Orders" value={orders.filter(o => o.status.toLowerCase() === 'delivered').length} color="green" />
            <StatCard title="Pending Orders" value={orders.filter(o => o.status.toLowerCase() === 'processing').length} color="yellow" />
            <StatCard title="Total Spent" value={`₹${totalSpent.toFixed(2)}`} />
          </div>

          {/* Order History */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-gray-800">Order History</h3>
            {orders.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{order.items.length} items</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">₹{parseFloat(order.total_amount)?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status.toLowerCase() === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status.toLowerCase() === 'pending'
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

// Reusable Info Card
const InfoCard = ({ icon, title, content }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="flex items-center gap-2 font-medium text-lg mb-4">{icon} {title}</h3>
    <div className="space-y-3">
      {content.map((item, idx) => (
        <div key={idx}>
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className={`font-medium ${item.color ? `text-${item.color}-600` : ''} ${item.capitalize ? 'capitalize' : ''} flex items-center gap-1`}>
            {item.icon && item.icon} {item.value}
          </p>
          {item.note && <p className="text-xs text-gray-400">{item.note}</p>}
        </div>
      ))}
    </div>
  </div>
);

// Small reusable card for statistics
const StatCard = ({ title, value, color }) => (
  <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm ${color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : ''}`}>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default UserDetailsModal;
