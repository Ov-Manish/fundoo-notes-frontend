import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { setSearchQuery, searchNotes } from '../features/notes/noteSlice';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import TakeNotes from '../components/common/TakeNotes'
import NoteList from '../components/common/NoteList'
import EditLabelsModal from '../components/common/EditLabelsModal'

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchQuery, labels } = useSelector((state) => state.notes);

  // 1. Lifted State: Controls whether the left sidebar is expanded or collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. State for active view (e.g. 'notes', 'reminders', 'archive', 'trash')
  const [activeView, setActiveView] = useState('notes');

  // 3. State to control the Edit Labels Modal dialog overlay
  const [isEditLabelsOpen, setIsEditLabelsOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={toggleSidebar} 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Body Container (Sidebar + Main Workspace side-by-side) */}
      <div className="flex flex-1 pt-16">
        
        {/* Sidebar navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeView={activeView} 
          onViewChange={setActiveView} 
          onEditLabelsClick={() => setIsEditLabelsOpen(true)}
        />

        {/* Main Content Area */}
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
                <h2 className="text-xl font-bold text-gray-700 dark:text-zinc-200 border-b dark:border-zinc-800 pb-2 select-none">
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
                    <h2 className="text-xl font-bold text-gray-700 dark:text-zinc-200 border-b dark:border-zinc-800 pb-2 select-none">Reminders Workspace</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView === 'archive' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-zinc-200 border-b dark:border-zinc-800 pb-2 select-none">Archive Workspace</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView === 'trash' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-zinc-200 border-b dark:border-zinc-800 pb-2 select-none">Trash Bin</h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
                {activeView.startsWith('label-') && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-zinc-200 border-b dark:border-zinc-800 pb-2 select-none">
                      Label Workspace: {labels.find((l) => `label-${l.id}` === activeView)?.name || 'Notes'}
                    </h2>
                    <NoteList activeView={activeView} />
                  </div>
                )}
              </>
            )}

          </div>
        </main>

      </div>

      {/* Edit Labels Modal Overlay dialog */}
      {isEditLabelsOpen && (
        <EditLabelsModal onClose={() => setIsEditLabelsOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;
