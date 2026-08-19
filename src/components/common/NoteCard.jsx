import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Archive, Palette, RotateCcw, Bell } from 'lucide-react'
import { trashNote, restoreNote, updateNote, toggleArchiveNote, createReminder } from '../../features/notes/noteSlice'

const NoteCard = ({ note }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reminders } = useSelector((state) => state.notes);

  // Safely extract properties to support both Java Lombok and Jackson JSON serialization names
  const isDeleted = note.isDeleted !== undefined ? note.isDeleted : note.deleted;
  const isArchived = note.isArchived !== undefined ? note.isArchived : note.archived;

  // Search if this note has an active reminder in state
  const activeReminder = reminders.find((r) => r.noteId === note.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title || '');
  const [editDescription, setEditDescription] = useState(note.description || '');

  // Reminder popover states
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState('');

  // Pastel colors list mapping Google Keep palette
  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#f28b82' },
    { name: 'Orange', value: '#fbbc04' },
    { name: 'Yellow', value: '#fff475' },
    { name: 'Green', value: '#ccff90' },
    { name: 'Teal', value: '#a7ffeb' },
    { name: 'Blue', value: '#cbf0f8' },
    { name: 'Dark Blue', value: '#aecbfa' },
    { name: 'Purple', value: '#d7aefb' },
    { name: 'Pink', value: '#fdcfe8' },
    { name: 'Brown', value: '#e6c9a8' },
    { name: 'Gray', value: '#e8eaed' }
  ];

  const handleCloseModal = () => {
    // Only dispatch update if values actually changed to avoid unnecessary API requests
    if (editTitle !== note.title || editDescription !== note.description) {
      dispatch(updateNote({ 
        noteId: note.id, 
        noteData: { 
          title: editTitle, 
          description: editDescription,
          color: note.color || '#ffffff'
        } 
      }));
    }
    setIsModalOpen(false);
  };

  const handleColorChange = (newColor) => {
    dispatch(updateNote({
      noteId: note.id,
      noteData: {
        title: note.title,
        description: note.description,
        color: newColor
      }
    }));
  };

  const handleSaveReminder = () => {
    if (!reminderDateTime || !user) return;
    const email = typeof user === 'object' ? user.email : user;
    if (!email) return;

    dispatch(createReminder({
      noteId: note.id,
      userEmail: email,
      message: `Reminder alert: ${note.title || 'Untitled Note'}`,
      reminderTime: reminderDateTime
    }));

    setIsReminderOpen(false);
  };

  return (
    <>
      {/* Note Card Body */}
      <div 
        onClick={() => {
          if (!isDeleted) {
            setIsModalOpen(true);
          }
        }}
        className={`border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group h-fit ${
          !isDeleted ? 'cursor-pointer hover:border-gray-300' : ''
        }`}
        style={{ backgroundColor: note.color || '#ffffff' }} // Dynamic Background Color
      >
          {/* 1. Note Text fields */}
          <div className="space-y-2">
              {/* Title (render only if it exists) */}
              {note.title && (
                  <h3 className="text-base font-bold text-gray-800 tracking-tight leading-snug break-words">
                      {note.title}
                  </h3>
              )}
              {/* Description */}
              <p className="text-sm text-gray-600 whitespace-pre-wrap break-words line-clamp-6 leading-relaxed">
                  {note.description}
              </p>

              {/* Active Reminder Chip Display */}
              {activeReminder && (
                <div 
                  onClick={(e) => e.stopPropagation()} // Prevent opening the edit modal when clicking chip
                  className="flex items-center gap-1 mt-3 text-[10px] font-bold bg-black/5 text-gray-600 px-2 py-0.5 rounded-full w-fit max-w-full select-none"
                >
                  <Bell size={10} className="text-gray-500" />
                  <span className="truncate">
                    {new Date(activeReminder.reminderTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
          </div>

          {/* 2. Hover Action Toolbar */}
          <div className="flex items-center gap-3 mt-4 pt-2 border-t border-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500">
              {isDeleted ? (
                  /* Trashed Note Toolbar: Show Restore Option */
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the edit modal
                      dispatch(restoreNote(note.id));
                    }}
                    className="p-1.5 hover:bg-yellow-50 rounded-full hover:text-yellow-600 transition-colors"
                    title="Restore note"
                  >
                      <RotateCcw size={16}/>
                  </button>
              ) : (
                  /* Active Note Toolbar: Show Color, Archive, Reminder, and Trash options */
                  <>
                    {/* Hover Color Picker */}
                    <div className="relative group/palette">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-1.5 hover:bg-black/5 rounded-full hover:text-gray-800 transition-colors" 
                        title="Change Color"
                      >
                          <Palette size={16}/>
                      </button>
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute bottom-[95%] left-0 hidden group-hover/palette:grid grid-cols-4 gap-1 p-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-32"
                      >
                        {colors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => handleColorChange(c.value)}
                            className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Reminder Popover */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReminderOpen(!isReminderOpen);
                        }} 
                        className={`p-1.5 rounded-full transition-colors ${
                          activeReminder 
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                            : 'hover:bg-black/5 hover:text-gray-800'
                        }`}
                        title="Add reminder"
                      >
                          <Bell size={16}/>
                      </button>
                      
                      {isReminderOpen && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 w-56 flex flex-col space-y-2"
                        >
                          <h4 className="text-[10px] font-bold text-gray-700 select-none pb-1 border-b border-gray-100">Schedule Reminder</h4>
                          <input 
                            type="datetime-local" 
                            value={reminderDateTime}
                            onChange={(e) => setReminderDateTime(e.target.value)}
                            className="text-[10px] border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-yellow-500 w-full bg-gray-50/50"
                          />
                          <button 
                            onClick={handleSaveReminder}
                            className="text-[10px] py-1.5 bg-yellow-500 hover:bg-yellow-600 !text-white font-bold rounded-lg transition-colors shadow-sm w-full"
                          >
                            Save Reminder
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the edit modal
                        dispatch(toggleArchiveNote(note.id));
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isArchived 
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                          : 'hover:bg-black/5 hover:text-gray-800'
                      }`}
                      title={isArchived ? "Unarchive note" : "Archive note"}
                    >
                        <Archive size={16}/>
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the edit modal
                        dispatch(trashNote(note.id));
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-full hover:text-red-600 transition-colors ml-auto"
                      title="Delete note"
                    >
                        <Trash2 size={16}/>
                    </button>
                  </>
              )}
          </div>
      </div>

      {/* 3. The Edit Modal Overlay */}
      {isModalOpen && (
        <div 
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
            className="rounded-2xl w-full max-w-xl shadow-2xl p-6 border border-gray-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: note.color || '#ffffff' }} // Dynamic Background Color inside Modal
          >
            {/* Title Input */}
            <input 
              type="text" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="text-lg font-bold text-gray-800 focus:outline-none placeholder-gray-400 w-full bg-transparent"
            />

            {/* Description Textarea */}
            <textarea 
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Note description..."
              rows={6}
              className="text-sm text-gray-600 focus:outline-none placeholder-gray-400 w-full resize-none leading-relaxed bg-transparent"
            />

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-black/10 pt-3 mt-2">
              <span className="text-xs text-gray-500 italic">Edited just now</span>
              <button 
                onClick={handleCloseModal}
                className="px-5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NoteCard;
