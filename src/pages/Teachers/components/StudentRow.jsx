import React from 'react';

const StudentRow = ({ name, number, status, score }) => (
  <tr className="border-b last:border-none">
    <td className="py-3">{name}</td>
    <td>{number}</td>
    <td>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold
        ${status === "At Risk" ? "bg-red-100 text-red-600" : 
          status === "Monitor" ? "bg-yellow-100 text-yellow-600" : 
          "bg-green-100 text-green-600"}`}>
        {status}
      </span>
    </td>
    <td>{score}</td>
  </tr>
);

export default StudentRow;