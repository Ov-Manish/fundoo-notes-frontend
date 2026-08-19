import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react'
import { fetchNotes, fetchTrashedNotes, fetchArchivedNotes, fetchActiveReminders } from '../../features/notes/noteSlice'
import NoteCard from './NoteCard'

const NoteList = ({ activeView }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { notes, trashedNotes, archivedNotes, reminders, searchResults, searchQuery, loading, error } = useSelector((state) => state.notes);

    // Fetches the correct Notes depending on activeView
    useEffect(() => {
        if (activeView === 'notes') {
            dispatch(fetchNotes());
        } else if (activeView === 'trash') {
            dispatch(fetchTrashedNotes());
        } else if (activeView === 'archive') {
            dispatch(fetchArchivedNotes());
        } else if (activeView === 'reminders') {
            dispatch(fetchNotes()); // Fetch active notes to filter against reminders
        }
        
        // Fetch active reminders if user email is present
        if (user && user.email) {
            dispatch(fetchActiveReminders(user.email));
        }
    }, [activeView, dispatch, user]);

    // Choose which notes array to render
    const currentNotes = 
        searchQuery.trim() !== '' ? searchResults :
        activeView === 'trash' ? trashedNotes : 
        activeView === 'archive' ? archivedNotes : 
        activeView === 'reminders' ? notes.filter((note) => reminders.some((r) => r.noteId === note.id)) :
        notes;

    // If Loading is True and Data has not Come then Loading Component Will render
    if (loading && currentNotes.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin text-yellow-500 mb-2" size={32} />
                <p className="text-sm font-medium">Loading your notes workspace...</p>
            </div>
        )
    }

    // If Error it will show error message
    if (error) {
        return (
             <div className="text-center py-10 text-red-500 font-medium">
                  <p>{error}</p>
             </div>
        )
    }

    // If no notes exist in the current view
    if (currentNotes.length === 0) {
        return (
             <div className="text-center py-20 text-gray-400 select-none">
                <div className="text-5xl mb-4">{searchQuery.trim() ? '🔍' : '💡'}</div>
                <p className="text-lg font-semibold text-gray-500">
                    {searchQuery.trim() ? `No matching notes found` :
                     activeView === 'trash' ? 'No notes in Trash' : 
                     activeView === 'archive' ? 'No notes in Archive' : 
                     activeView === 'reminders' ? 'No notes with Reminders' :
                     'Notes you add appear here'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                    {searchQuery.trim() ? `Try searching for different keywords.` :
                     activeView === 'trash' ? 'Your deleted notes list is empty.' : 
                     activeView === 'archive' ? 'Your archived notes list is empty.' : 
                     activeView === 'reminders' ? 'Your scheduled reminders list is empty.' :
                     'Start writing notes to populate your workspace.'}
                </p>
            </div>
        )
    }

    // If the Notes are Available then this will render them one by one 
    return (
      <div className="w-full mt-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {currentNotes.map((note) => (
            <div key={note.id || note._id} className="inline-block w-full break-inside-avoid mb-4">
              <NoteCard note={note} />
            </div>
          ))}
        </div>
      </div>
    );
}

export default NoteList;
