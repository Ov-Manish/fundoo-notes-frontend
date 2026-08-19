import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { setSearchQuery, searchNotes } from '../features/notes/noteSlice';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import TakeNotes from '../components/common/TakeNotes'
import NoteList from '../components/common/NoteList'

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.notes);

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

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
    if (query.trim()) {
      dispatch(searchNotes(query));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 3. The Top Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={toggleSidebar} 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
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

            {/* Note taking workspace (Show only on the active "Notes" tab and when search query is empty) */}
            {activeView === 'notes' && !searchQuery.trim() && (
              <div className="max-w-xl mx-auto mb-8">
                 <TakeNotes />
              </div>
            )}

            {/* Render dynamically filtered workspaces */}
            {searchQuery.trim() ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-2 select-none">
                  Search Results for "{searchQuery}"
                </h2>
                <NoteList activeView={activeView} />
              </div>
            ) : (
              <>
                {activeView === 'notes' && (
                  <div className="space-y-6">
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView === 'reminders' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 border-b pb-2 select-none">Reminders Workspace</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView === 'archive' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 border-b pb-2 select-none">Archive Workspace</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView === 'trash' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 border-b pb-2 select-none">Trash Bin</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
              </>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;
