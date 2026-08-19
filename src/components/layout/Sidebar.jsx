import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Lightbulb, Bell, Archive, Trash2, Tag, Pencil } from 'lucide-react'
import { fetchLabels } from '../../features/notes/noteSlice'

const Sidebar = ({ isOpen, activeView, onViewChange, onEditLabelsClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { labels } = useSelector((state) => state.notes);

  // Fetch labels when sidebar loads and user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchLabels());
    }
  }, [dispatch, user]);

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
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* 1. Main Navigation Menu */}
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
                  <div className={`mr-4 ${isActive ? 'text-yellow-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                    <Icon size={20} />
                  </div>
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

        {/* Divider line and LABELS section */}
        {labels.length > 0 && (
          <div className="border-t border-gray-100 my-4 pt-4 px-7">
            <span className={`text-[10px] font-bold text-gray-400 tracking-widest uppercase select-none ${
              isOpen ? 'block' : 'hidden'
            }`}>
              Labels
            </span>
          </div>
        )}

        {/* 2. Custom Labels List */}
        <ul className="space-y-1 px-3">
          {labels.map((label) => {
            const isActive = activeView === `label-${label.id}`;
            return (
              <li key={label.id}>
                <button
                  onClick={() => onViewChange(`label-${label.id}`)}
                  className={`w-full flex items-center h-11 rounded-xl transition-all duration-200 px-4 group ${
                    isActive 
                      ? 'bg-yellow-100 text-yellow-800 font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mr-4 ${isActive ? 'text-yellow-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                    <Tag size={18} />
                  </div>
                  <span
                    className={`text-sm tracking-wide whitespace-nowrap truncate transition-all duration-300 ${
                      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    {label.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Edit Labels Button at the bottom */}
      <div className="px-3 border-t border-gray-100 pt-4 mt-auto">
        <button
          onClick={onEditLabelsClick}
          className="w-full flex items-center h-12 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 px-4 group"
        >
          <div className="mr-4 text-gray-500 group-hover:text-gray-800">
            <Pencil size={18} />
          </div>
          <span
            className={`text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            Edit labels
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar;
