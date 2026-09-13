import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 text-center text-sm mt-auto">
      <p>&copy; {new Date().getFullYear()} Rural Telemedicine Access. Supporting remote healthcare.</p>
    </footer>
  );
}