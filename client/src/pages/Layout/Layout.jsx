import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="fixed top-0 left-0 h-full bg-gray-800 text-white" />
      <div className="flex flex-col flex-1">
        <Header className="sticky top-0 w-full bg-gray-100 shadow-md" />
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
