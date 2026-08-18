import React , {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Loader2} from 'lucide-react'
import {fetchNotes} from '../../features/notes/noteSlice'
import NoteCard from './NoteCard'
const NoteList = () => {
    const dispatch = useDispatch();
    const {notes , loading , error} = useSelector((state)=> state.notes);

    // Fetches the Notes when Load this Component
    useEffect(()=>{
        dispatch(fetchNotes());
    },[dispatch]);


// If Loading is True and Data has not Come then Loading Component Will render
    if (loading && notes.length === 0 ) {
        return(
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin text-yellow-500 mb-2" size={32} />
                <p className="text-sm font-medium">Loading your notes workspace...</p>
            </div>
        )
    }


    // If Error it will show error message

    if (error) {
        return(
             <div className="text-center py-10 text-red-500 font-medium">
                 <p>{error}</p>
            </div>
        )
    }


    // If not a single Notes has not created Yet 
    if (notes.length === 0) {
        return (
             <div className="text-center py-20 text-gray-400 select-none">
                <div className="text-5xl mb-4">💡</div>
                <p className="text-lg font-semibold text-gray-500">Notes you add appear here</p>
                <p className="text-sm text-gray-400 mt-1">Start writing notes to populate your workspace.</p>
            </div>
        )
    }


    // If the Notes are Available then this will render them one by one 
  return (
    <div className="w-full mt-8">
      <div className=" columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {notes.map((note) => (
          <div key={note.id || note._id} className="inline-block w-full break-inside-avoid mb-4">
            <NoteCard key={note.id || note._id} note={note} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteList
