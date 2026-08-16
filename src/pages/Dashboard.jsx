import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 1. Lifted State: Controls whether the left sidebar is expanded or collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. State for active view (e.g. 'notes', 'reminders', 'archive', 'trash')
  const [activeView, setActiveView] = useState('notes');

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 3. The Top Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={toggleSidebar} 
      />

      {/* 4. The Body Container (Sidebar + Main Workspace side-by-side) */}
      <div className="flex flex-1 pt-16">
        
        {/* The Sidebar navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />

        {/* 5. Main Content Area */}
        <main className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}>
          <div className="max-w-6xl mx-auto">
            {/* Conditional Rendering based on activeView */}
            {activeView === 'notes' && (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-3xl p-12 shadow-sm max-w-lg mx-auto mt-10">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Workspace Ready</h2>
                <p className="text-gray-500 mb-6">
                  You have authenticated successfully. In the next phase, we will configure note-taking components here!
                </p>
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Connected to Microservices
                </div>
              </div>
            )}
            {activeView === 'reminders' && (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-3xl p-12 shadow-sm max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Reminders View</h2>
                <p className="text-gray-500 mt-2">Active reminders will appear here.</p>
              </div>
            )}
            {activeView === 'archive' && (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-3xl p-12 shadow-sm max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Archived Notes View</h2>
                <p className="text-gray-500 mt-2">Archived notes will appear here.</p>
              </div>
            )}
            {activeView === 'trash' && (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-3xl p-12 shadow-sm max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold text-gray-800">Trash Bin View</h2>
                <p className="text-gray-500 mt-2">Trashed notes will appear here.</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;
