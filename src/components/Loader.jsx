import React from 'react';

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center py-6 space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-green-600"></div>
      <p className="text-gray-500 text-sm font-medium">{message}</p>
    </div>
  );
}