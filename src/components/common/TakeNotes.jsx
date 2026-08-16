import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import {Plus , Pin , Archive, Palette} from 'lucide-react'
import {addNotes} from '../../features/notes/noteSlice'


const TakeNotes = () => {

    const dispatch = useDispatch();

    // Controls whether the note box is expanded or collapsed
    const [isExpanded , setIsExpanded] = useState(false);

    // Local State for the note inputs
    const [title , setTitle] = useState('');
    const [description , setDescription] = useState('');

    
    // Save and Close handler
    const handleClose = () =>{
        setIsExpanded(false);

        if (title.trim() || description.trim()) {
            dispatch(addNotes({title,description}));
        }

        setTitle('');
        setDescription('');
    }
  return (
    <div className="w-full max-w-xl mx-auto mt-6 transition-all duration-300">

        {/* Notes Createor Box Cart */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 transition-shadow">
            <form onSubmit={(e)=> e.preventDefault()} className="space-y-3">
                {/* Expanded State : Title and Pin Button */}
                {isExpanded && (
                    <div className="flex justify-between items-center">
                            <input 
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            className="w-full text-base font-bold text-gray-800 placeholder-gray-400 border-none focus:outline-none"
                            />

                            <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors">
                                <Pin size={18}/>  
                            </button>
                    </div>
                )}

                {/* Core Tnput : Take a Note (Description) */}
                <textarea 
                placeholder="Take a Note..."
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                onClick={()=> setIsExpanded(true)} // helps to expand the card when clicked

                rows={isExpanded ? 3 : 1}
                className="w-full text-sm text-gray-700 placeholder-gray-500 border-none resize-none focus:outline-none"
                />

                    {/* Expanded State Toolbar */}
                    {isExpanded && (
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">

                            <div className="flex items-center gap-2 text-gray-500">

                                {/*  BUTTON 1 - Toolbar Button  */}
                                <button className="p-2 hover:bg-gray-100 rounded-full hover:text-gray-800 transition-colors" title="Change Color">

                                    <Palette size={18}/>
                                    
                                </button>

                                {/* BUTTON 2  - Archieve*/}
                                <button className="p-2 hover:bg-gray-100 rounded-full hover:text-gray-800 transition-colors" title="Archive">

                                    <Archive size={18}/>

                                </button>
                            </div>
                             {/* Close / Save Button */}
                                <button 
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
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

export default TakeNotes
