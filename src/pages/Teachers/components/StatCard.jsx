import React from 'react';

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
  </div>
);

export default StatCard;