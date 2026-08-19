import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Plus, Pin, Archive, Palette } from 'lucide-react'
import { addNotes } from '../../features/notes/noteSlice'

const TakeNotes = () => {
    const dispatch = useDispatch();
    const containerRef = useRef(null);

    // Controls whether the note box is expanded or collapsed
    const [isExpanded, setIsExpanded] = useState(false);

    // Local State for the note inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Save and Close handler
    const handleClose = () => {
        setIsExpanded(false);

        if (title.trim() || description.trim()) {
            dispatch(addNotes({ title, description }));
        }

        setTitle('');
        setDescription('');
    }

    // Effect to detect click outside the note creator container
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If click is outside the card, trigger save and close
            if (isExpanded && containerRef.current && !containerRef.current.contains(event.target)) {
                handleClose();
            }
        };

        // Bind listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup listener on unmount/re-run
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded, title, description]); // Dependencies ensure we capture the latest text values

    return (
        <div 
            ref={containerRef} // Attach ref to track click boundaries
            className="w-full max-w-xl mx-auto mt-6 transition-all duration-300"
        >
            {/* Notes Creator Box Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-md p-4 transition-shadow">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                    {/* Expanded State: Title and Pin Button */}
                    {isExpanded && (
                        <div className="flex justify-between items-center">
                            <input 
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-base font-bold text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 border-none bg-transparent focus:outline-none"
                            />
                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors">
                                <Pin size={18}/>  
                            </button>
                        </div>
                    )}

                    {/* Core Input: Take a Note (Description) */}
                    <textarea 
                        placeholder="Take a Note..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onClick={() => setIsExpanded(true)} // Expands the card when clicked
                        rows={isExpanded ? 3 : 1}
                        className="w-full text-sm text-gray-700 dark:text-zinc-300 placeholder-gray-500 dark:placeholder-zinc-400 border-none resize-none bg-transparent focus:outline-none"
                    />

                    {/* Expanded State Toolbar */}
                    {isExpanded && (
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full hover:text-gray-800 dark:hover:text-zinc-200 transition-colors" title="Change Color">
                                    <Palette size={18}/>
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full hover:text-gray-800 dark:hover:text-zinc-200 transition-colors" title="Archive">
                                    <Archive size={18}/>
                                </button>
                            </div>
                            
                            {/* Close / Save Button */}
                            <button 
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default TakeNotes;
