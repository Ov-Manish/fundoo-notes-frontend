import React, { useState, useEffect } from 'react'
import { Menu, Search, LogOut, Sun, Moon } from 'lucide-react'

const Header = ({ user, onLogout, onToggleSidebar, searchQuery, onSearchChange }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync theme with document class and dataset attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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

      {/* Right Section: Theme Toggle, User Profile & Logout */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-zinc-400 focus:outline-none"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Info Greeting */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 font-medium">Logged in as</p>
          <p className="text-sm font-bold text-gray-700 dark:text-zinc-200">{user && typeof user === 'object' ? user.email : user}</p>
        </div>

        {/* Profile Circle Icon */}
        <div className="h-9 w-9 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white shadow-sm cursor-default select-none">
          {user ? (typeof user === 'object' ? user.email : user).charAt(0).toUpperCase() : 'U'}
        </div>

        {/* Logout Icon Button */}
        <button
          onClick={onLogout}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 text-gray-500 dark:text-zinc-400 rounded-full transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Header;
