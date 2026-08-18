import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import AlertDetailsDrawer from '../components/alerts/AlertDetailsDrawer';
import { useSSE } from '../hooks/useSSE';
import { usePolling } from '../hooks/usePolling';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize background live SSE stream and periodic polling to Redux store
  useSSE();
  usePolling();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Global Alert Drawer Inspector */}
      <AlertDetailsDrawer />
    </div>
  );
}
