import React from 'react'
import {Menu , Search , LogOut} from 'lucide-react'

const Header = ({user , onLogout , onToggleSidebar}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm">
      
      {/* Left Side : Hamburgure Menu and LOGO */}
      <div className="flex items-center gap-3">
        <button 
        onClick={onToggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 focus:outline-none"
        
        title="Main menu">
            <Menu size={20}/>
        </button>


        {/* Brand Names */}

        <div className="flex items-center gap-1 select-none">
            <span className="text-2xl font-black text-yellow-500 tracking-tight">Fundoo</span>
            <span className="text-2xl font-semibold text-gray-700">Notes</span>
        </div>
      </div>

      {/* MIDDLE SECTION : SEARCH BAR ( GOOGLE KEEP STYLE ) */}

         <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative flex items-center w-full bg-gray-100 focus-within:bg-white border border-transparent focus-within:border-gray-200 focus-within:shadow-md rounded-xl transition-all duration-200">
                <div className="pl-4 pr-3 text-gray-500 pointer-events-none">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full py-2.5 pr-4 text-sm bg-transparent border-none text-gray-900 placeholder-gray-500 focus:outline-none"
                />
            </div>
        </div>

         {/* 3. Right Section: User Profile & Logout */}
      <div className="flex items-center gap-4">
        {/* User Info Greeting */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 font-medium">Logged in as</p>
          <p className="text-sm font-bold text-gray-700">{user}</p>
        </div>
        {/* Profile Circle Icon Placeholder */}
        <div className="h-9 w-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-white shadow-sm cursor-default">
          {user ? user.charAt(0).toUpperCase() : 'U'}
        </div>
        {/* Logout Icon Button */}
        <button
          onClick={onLogout}
          className="p-2 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-full transition-all border border-transparent hover:border-red-100"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Header
