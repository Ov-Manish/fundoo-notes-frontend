import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Check, Trash2, Edit2, X } from 'lucide-react'
import { createLabel, updateLabelName, deleteLabel } from '../../features/notes/noteSlice'

const EditLabelsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { labels } = useSelector((state) => state.notes);
  const [newLabelName, setNewLabelName] = useState('');
  
  // Track which label is currently being edited
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelValue, setEditingLabelValue] = useState('');

  const handleCreate = () => {
    if (!newLabelName.trim()) return;
    dispatch(createLabel(newLabelName.trim()));
    setNewLabelName('');
  };

  const handleRename = (id) => {
    if (!editingLabelValue.trim()) return;
    dispatch(updateLabelName({ id, name: editingLabelValue.trim() }));
    setEditingLabelId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteLabel(id));
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-xs shadow-2xl p-5 border border-gray-100 dark:border-zinc-800 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-100 select-none pb-2 border-b border-gray-100 dark:border-zinc-800">
          Edit labels
        </h3>

        {/* 1. Create label input row */}
        <div className="flex items-center gap-2 py-1">
          {newLabelName.trim() ? (
            <button onClick={() => setNewLabelName('')} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 dark:text-zinc-400">
              <X size={16} />
            </button>
          ) : (
            <div className="p-1 text-gray-400 dark:text-zinc-500">
              <Plus size={16} />
            </div>
          )}
          <input 
            type="text" 
            placeholder="Create new label..."
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="text-xs bg-transparent flex-1 focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 font-medium text-gray-800 dark:text-zinc-150"
          />
          {newLabelName.trim() && (
            <button onClick={handleCreate} className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 rounded-full text-yellow-600 dark:text-yellow-400">
              <Check size={16} />
            </button>
          )}
        </div>

        {/* 2. Existing labels list */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {labels.map((label) => {
            const isEditing = editingLabelId === label.id;
            return (
              <div key={label.id} className="flex items-center gap-2 group/row py-1">
                {/* Left Hover Delete Button */}
                <button 
                  onClick={() => handleDelete(label.id)}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 rounded-full cursor-pointer"
                  title="Delete label"
                >
                  <Trash2 size={14} />
                </button>

                {/* Middle input */}
                <input 
                  type="text" 
                  value={isEditing ? editingLabelValue : label.name}
                  onChange={(e) => setEditingLabelValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(label.id)}
                  className={`text-xs flex-1 bg-transparent focus:outline-none font-medium border-b border-transparent text-gray-800 dark:text-zinc-150 ${
                    isEditing ? 'border-yellow-400 bg-gray-50 dark:bg-zinc-800 p-1 rounded-md' : ''
                  }`}
                />

                {/* Right Edit/Check Action button */}
                {isEditing ? (
                  <button 
                    onClick={() => handleRename(label.id)} 
                    className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 rounded-full cursor-pointer"
                    title="Save rename"
                  >
                    <Check size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingLabelId(label.id);
                      setEditingLabelValue(label.name);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                    title="Rename label"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Footer close button */}
        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-zinc-800">
          <button 
            onClick={onClose}
            className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLabelsModal;
