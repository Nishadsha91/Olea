import React from 'react';

function StatCard({ title, value, Icon }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition">
      <div className="p-4 bg-purple-100 text-purple-700 rounded-xl">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;
