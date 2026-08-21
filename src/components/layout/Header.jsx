import React, { useState, useEffect, useRef } from 'react'
import { Menu, Search, LogOut, Sun, Moon, Camera } from 'lucide-react'
import axios from 'axios'

const Header = ({ user, onLogout, onToggleSidebar, searchQuery, onSearchChange }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [profile, setProfile] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const menuRef = useRef(null);

  // Sync theme with document attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load user profile details on mount
  const fetchUserProfile = () => {
    if (user) {
      axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then((res) => {
        setProfile(res.data);
        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
      })
      .catch((err) => console.error("Error loading user profile: ", err));
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Upload Base64 Profile Picture to user-service
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 1MB to keep database fast)
    if (file.size > 1024 * 1024) {
      alert("Image is too large. Please select an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedDetails = {
        firstName: profile?.firstName || 'New',
        lastName: profile?.lastName || 'User',
        profilePicUrl: base64String,
        phoneNumber: profile?.phoneNumber || ''
      };
      
      updateUserProfileDetails(updatedDetails);
    };
    reader.readAsDataURL(file);
  };

  // Update profile details on the backend
  const updateUserProfileDetails = (updatedDetails) => {
    axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/user/update`,
      updatedDetails,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    .then((res) => {
      setProfile(res.data);
      setFirstName(res.data.firstName || '');
      setLastName(res.data.lastName || '');
    })
    .catch((err) => {
      console.error("Error updating user profile: ", err);
      alert("Failed to update profile. Make sure the database column size is altered to LONGTEXT.");
    });
  };

  const handleUpdateName = () => {
    const updatedDetails = {
      firstName: firstName.trim() || 'New',
      lastName: lastName.trim() || 'User',
      profilePicUrl: profile?.profilePicUrl || '',
      phoneNumber: profile?.phoneNumber || ''
    };
    updateUserProfileDetails(updatedDetails);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 z-50 shadow-sm transition-colors duration-200">
      
      {/* Left Side: Hamburger Menu and LOGO */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-600 dark:text-zinc-400 focus:outline-none"
          title="Main menu"
        >
          <Menu size={20}/>
        </button>

        {/* Brand Names */}
        <div className="flex items-center gap-1 select-none">
          <span className="text-2xl font-black text-yellow-500 tracking-tight">Fundoo</span>
          <span className="text-2xl font-semibold text-gray-700 dark:text-zinc-100">Notes</span>
        </div>
      </div>

      {/* MIDDLE SECTION: SEARCH BAR */}
      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <div className="relative flex items-center w-full bg-gray-100 dark:bg-zinc-800 focus-within:bg-white dark:focus-within:bg-zinc-900 border border-transparent focus-within:border-gray-200 dark:focus-within:border-zinc-700 focus-within:shadow-md rounded-xl transition-all duration-200">
          <div className="pl-4 pr-3 text-gray-500 dark:text-zinc-400 pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2.5 pr-4 text-sm bg-transparent border-none text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Section: Theme Toggle & Profile Popover */}
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-zinc-400 focus:outline-none"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Profile Circle Icon (Clickable Avatar) */}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="h-9 w-9 bg-yellow-450 dark:bg-yellow-550 rounded-full flex items-center justify-center font-bold text-white shadow-sm overflow-hidden select-none cursor-pointer border-2 border-transparent focus:border-yellow-500"
          title="Google Account"
        >
          {profile && profile.profilePicUrl ? (
            <img src={profile.profilePicUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span>{user ? (typeof user === 'object' ? user.email : user).charAt(0).toUpperCase() : 'U'}</span>
          )}
        </button>

        {/* Google Account Popover Menu */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 top-12 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-2xl p-6 z-50 w-72 flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-top-3 duration-250 border-gray-100/50">
            {/* User Account Info */}
            <div className="flex flex-col items-center space-y-2 select-none w-full text-center">
              <div className="h-20 w-20 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center font-black text-3xl text-white shadow-inner overflow-hidden relative group/avatar cursor-pointer">
                {profile && profile.profilePicUrl ? (
                  <img src={profile.profilePicUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span>{user ? (typeof user === 'object' ? user.email : user).charAt(0).toUpperCase() : 'U'}</span>
                )}
                
                {/* Upload Image Overlay trigger */}
                <label className="absolute inset-0 bg-black/45 text-[9px] text-white font-bold flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={16} className="mb-0.5" />
                  Change
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>
              
              <h4 className="text-base font-bold text-gray-800 dark:text-zinc-100 truncate w-full px-2 mt-2">
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Fundoo User'}
              </h4>
              <p className="text-xs text-gray-400 dark:text-zinc-400 truncate w-full px-2">
                {user && typeof user === 'object' ? user.email : user}
              </p>
            </div>

            {/* Dynamic Name Edit Pane */}
            {isEditingName ? (
              <div className="w-full flex flex-col space-y-2.5 pt-3 border-t border-gray-100 dark:border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <label className="text-[9px] font-bold text-gray-450 dark:text-zinc-500 tracking-wider uppercase select-none">Update Name</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-2 rounded-lg w-1/2 focus:outline-none focus:border-yellow-500 text-gray-800 dark:text-zinc-200"
                  />
                  <input 
                    type="text" 
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-2 rounded-lg w-1/2 focus:outline-none focus:border-yellow-500 text-gray-800 dark:text-zinc-200"
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="w-1/2 text-[10px] font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateName();
                      setIsEditingName(false);
                    }}
                    className="w-1/2 text-[10px] font-bold text-white bg-yellow-500 hover:bg-yellow-600 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingName(true)}
                className="px-4 py-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors cursor-pointer w-fit shadow-sm select-none"
              >
                Manage Account Name
              </button>
            )}

            {/* Logout Option */}
            <div className="w-full pt-3 border-t border-gray-100 dark:border-zinc-700">
              <button 
                onClick={onLogout}
                className="w-full py-2 bg-gray-50 dark:bg-zinc-800/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-700 dark:text-zinc-300 hover:text-red-650 dark:hover:text-red-400 font-bold text-xs border border-gray-200 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header;
