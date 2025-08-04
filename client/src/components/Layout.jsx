// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import VoiceControls from './VoiceControls';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <VoiceControls />
    </div>
  );
};

export default Layout;