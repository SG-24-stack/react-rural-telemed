import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}