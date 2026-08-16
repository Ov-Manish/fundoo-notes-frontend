import React from 'react'
import {Lightbulb , Bell , Archive , Trash2} from 'lucide-react'

const Sidebar = ({isOpen , activeView , onViewChange}) => {

   const menuItems = [
    { id: 'notes', label: 'Notes', icon: Lightbulb },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];
    
  return (
    <aside 
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 z-40 transition-all duration-300 flex flex-col justify-between py-4 ${
            isOpen ? 'w-64' : 'w-20'
            }`}
    >

        {/* Navigation Menu List */}
       <ul className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center h-12 rounded-xl transition-all duration-200 px-4 group ${
                  isActive 
                    ? 'bg-yellow-100 text-yellow-800 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {/* Active Indicator Left Highlight */}
                <div className={`mr-4 ${isActive ? 'text-yellow-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                  <Icon size={20} />
                </div>
                {/* Text Label (smooth opacity transition based on sidebar toggle) */}
                <span
                  className={`text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      
    </aside>
  )
}

export default Sidebar
