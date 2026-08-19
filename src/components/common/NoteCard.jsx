import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Trash2, Archive, Palette, RotateCcw, Bell, Tag } from 'lucide-react'
import { trashNote, restoreNote, updateNote, toggleArchiveNote, createReminder, deleteNotePermanently } from '../../features/notes/noteSlice'

const NoteCard = ({ note }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reminders, labels } = useSelector((state) => state.notes);

  // Safely extract properties to support both Java Lombok and Jackson JSON serialization names
  const isDeleted = note.isDeleted !== undefined ? note.isDeleted : note.deleted;
  const isArchived = note.isArchived !== undefined ? note.isArchived : note.archived;

  // Search if this note has an active reminder in state
  const activeReminder = reminders.find((r) => r.noteId === note.id);

  // State to hold attached label chips for this specific note
  const [attachedLabels, setAttachedLabels] = useState([]);
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title || '');
  const [editDescription, setEditDescription] = useState(note.description || '');

  // Reminder popover states
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState('');

  // Pastel CSS Variable Colors list mapping Google Keep palette
  const colors = [
    { name: 'White', value: 'var(--note-default)' },
    { name: 'Red', value: 'var(--note-red)' },
    { name: 'Orange', value: 'var(--note-orange)' },
    { name: 'Yellow', value: 'var(--note-yellow)' },
    { name: 'Green', value: 'var(--note-green)' },
    { name: 'Teal', value: 'var(--note-teal)' },
    { name: 'Blue', value: 'var(--note-blue)' },
    { name: 'Dark Blue', value: 'var(--note-darkblue)' },
    { name: 'Purple', value: 'var(--note-purple)' },
    { name: 'Pink', value: 'var(--note-pink)' },
    { name: 'Brown', value: 'var(--note-brown)' },
    { name: 'Gray', value: 'var(--note-gray)' }
  ];

  // Helper to map old hardcoded hex colors to theme-aware variables
  const getNoteBgColor = (color) => {
    if (!color) return 'var(--note-default)';
    const hexMap = {
      '#ffffff': 'var(--note-default)',
      '#f28b82': 'var(--note-red)',
      '#fbbc04': 'var(--note-orange)',
      '#fff475': 'var(--note-yellow)',
      '#ccff90': 'var(--note-green)',
      '#a7ffeb': 'var(--note-teal)',
      '#cbf0f8': 'var(--note-blue)',
      '#aecbfa': 'var(--note-darkblue)',
      '#d7aefb': 'var(--note-purple)',
      '#fdcfe8': 'var(--note-pink)',
      '#e6c9a8': 'var(--note-brown)',
      '#e8eaed': 'var(--note-gray)'
    };
    return hexMap[color.toLowerCase()] || color;
  };

  const fetchNoteLabels = () => {
    if (note.id) {
      axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/labels/note/${note.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then((res) => setAttachedLabels(res.data))
      .catch((err) => console.error("Error fetching note labels: ", err));
    }
  };

  useEffect(() => {
    fetchNoteLabels();
  }, [note.id]);

  const handleCloseModal = () => {
    if (editTitle !== note.title || editDescription !== note.description) {
      dispatch(updateNote({ 
        noteId: note.id, 
        noteData: { 
          title: editTitle, 
          description: editDescription,
          color: note.color || 'var(--note-default)'
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

  const handleToggleLabel = (labelId) => {
    const isAttached = attachedLabels.some((l) => l.id === labelId);
    const url = isAttached ? 'unmap' : 'map';
    const method = isAttached ? 'delete' : 'post';

    axios({
      method,
      url: `${import.meta.env.VITE_API_BASE_URL}/labels/${url}?noteId=${note.id}&labelId=${labelId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      fetchNoteLabels();
    })
    .catch((err) => console.error("Error toggling label assignment: ", err));
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
        className={`border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group h-fit ${
          !isDeleted ? 'cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700' : ''
        }`}
        style={{ backgroundColor: getNoteBgColor(note.color) }} // Theme-aware color binding
      >
          {/* 1. Note Text fields */}
          <div className="space-y-2">
              {note.title && (
                  <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100 tracking-tight leading-snug break-words">
                      {note.title}
                  </h3>
              )}
              <p className="text-sm text-gray-600 dark:text-zinc-300 whitespace-pre-wrap break-words line-clamp-6 leading-relaxed">
                  {note.description}
              </p>

              {/* Active Labels Chips Display */}
              {attachedLabels.length > 0 && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="flex flex-wrap gap-1 mt-3"
                >
                  {attachedLabels.map((lbl) => (
                    <div 
                      key={lbl.id} 
                      className="flex items-center gap-1 text-[9px] font-bold bg-black/5 dark:bg-white/10 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded-full select-none"
                    >
                      <Tag size={8} className="text-gray-400 dark:text-zinc-400" />
                      <span className="truncate max-w-[80px]">{lbl.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Reminder Chip Display */}
              {activeReminder && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="flex items-center gap-1 mt-3 text-[10px] font-bold bg-black/5 dark:bg-white/10 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded-full w-fit max-w-full select-none"
                >
                  <Bell size={10} className="text-gray-500 dark:text-zinc-400" />
                  <span className="truncate">
                    {new Date(activeReminder.reminderTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
          </div>

          {/* 2. Hover Action Toolbar */}
          <div className="flex items-center gap-3 mt-4 pt-2 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 dark:text-zinc-400">
              {isDeleted ? (
                  <div className="flex items-center gap-2 w-full">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(restoreNote(note.id));
                        }}
                        className="p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 rounded-full hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                        title="Restore note"
                      >
                          <RotateCcw size={16}/>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteNotePermanently(note.id));
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
                        title="Delete forever"
                      >
                          <Trash2 size={16}/>
                      </button>
                  </div>
              ) : (
                  <>
                    {/* Hover Color Picker */}
                    <div className="relative group/palette">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full hover:text-gray-800 dark:hover:text-zinc-200 transition-colors" 
                        title="Change Color"
                      >
                          <Palette size={16}/>
                      </button>
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute bottom-[95%] left-0 hidden group-hover/palette:grid grid-cols-4 gap-1 p-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 w-32"
                      >
                        {colors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => handleColorChange(c.value)}
                            className="w-6 h-6 rounded-full border border-gray-250 dark:border-zinc-650 hover:scale-110 transition-transform"
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
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-zinc-200'
                        }`}
                        title="Add reminder"
                      >
                          <Bell size={16}/>
                      </button>
                      
                      {isReminderOpen && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 w-56 flex flex-col space-y-2"
                        >
                          <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 select-none pb-1 border-b border-gray-100 dark:border-zinc-700">Schedule Reminder</h4>
                          <input 
                            type="datetime-local" 
                            value={reminderDateTime}
                            onChange={(e) => setReminderDateTime(e.target.value)}
                            className="text-[10px] border border-gray-200 dark:border-zinc-700 rounded-lg p-1.5 focus:outline-none focus:border-yellow-500 w-full bg-gray-50/50 dark:bg-zinc-900/50 text-gray-800 dark:text-zinc-100"
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

                    {/* Tag Label Popover */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLabelsOpen(!isLabelsOpen);
                        }} 
                        className={`p-1.5 rounded-full transition-colors ${
                          attachedLabels.length > 0 
                            ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/40' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-zinc-200'
                        }`}
                        title="Change labels"
                      >
                          <Tag size={16}/>
                      </button>
                      
                      {isLabelsOpen && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 w-48 flex flex-col space-y-2"
                        >
                          <h4 className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 select-none pb-1 border-b border-gray-100 dark:border-zinc-700">Label Note</h4>
                          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                            {labels.length === 0 ? (
                              <p className="text-[9px] text-gray-400 dark:text-zinc-500 italic text-center py-2 select-none">No labels created yet</p>
                            ) : (
                              labels.map((label) => {
                                const isChecked = attachedLabels.some((l) => l.id === label.id);
                                return (
                                  <label 
                                    key={label.id} 
                                    className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900/50 p-1 rounded-md cursor-pointer text-[10px] font-semibold text-gray-600 dark:text-zinc-300 w-full"
                                  >
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked}
                                      onChange={() => handleToggleLabel(label.id)}
                                      className="rounded border-gray-300 dark:border-zinc-650 text-yellow-500 focus:ring-yellow-500 cursor-pointer h-3 w-3"
                                    />
                                    <span className="truncate">{label.name}</span>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleArchiveNote(note.id));
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isArchived 
                          ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/40' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-zinc-200'
                      }`}
                      title={isArchived ? "Unarchive note" : "Archive note"}
                    >
                        <Archive size={16}/>
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(trashNote(note.id));
                      }}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
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
            onClick={(e) => e.stopPropagation()} 
            className="rounded-2xl w-full max-w-xl shadow-2xl p-6 border border-gray-100 dark:border-zinc-800 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: getNoteBgColor(note.color) }} // Theme-aware color binding
          >
            {/* Title Input */}
            <input 
              type="text" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="text-lg font-bold text-gray-800 dark:text-zinc-100 focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 w-full bg-transparent"
            />

            {/* Description Textarea */}
            <textarea 
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Note description..."
              rows={6}
              className="text-sm text-gray-600 dark:text-zinc-300 focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 w-full resize-none leading-relaxed bg-transparent"
            />

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3 mt-2">
              <span className="text-xs text-gray-500 dark:text-zinc-400 italic">Edited just now</span>
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
