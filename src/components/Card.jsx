import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      {title && <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}