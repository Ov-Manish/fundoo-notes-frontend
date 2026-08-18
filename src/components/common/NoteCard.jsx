import React from 'react'
import {Trash2 , Archive , Palette} from 'lucide-react'

const NoteCard = ({note}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group h-fit">

        {/* Note Text fields */}
        <div className="space-y-2">
            {/* Title (render only if it exists) */}
            {
                note.title && (
                    <h3 className="text-base font-bold text-gray-800 tracking-tight leading-snug wrap-break-word">
                        
                        {note.title}
                        
                    </h3>

            )}
            {/* Description */}
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed wrap-break-word line-clamp-6 leading-relaxed">
                
                {note.description}
                
            </p>
        </div>


        {/* 2.Hover Action TOolbar (Hidden bu default , fades in on hover) */}

        <div className="flex items-center gap-3 mt-4 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500">
            {/* Change Color */}
            <button className="p-1.5 hover:bg-gray-100 rounded-full hover:text-gray-800 transition-colors"
            title="Change Color">
                <Palette size={16}/>
            </button>

            {/* Archive */}
            <button className="p-1.5 hover:bg-gray-100 rounded-full hover:text-gray-800 transition-colors"

            title="Archive note">
                <Archive size={16}/>
            </button>


            {/* Delete */}
            <button className="p-1.5 hover:bg-red-50 rounded-full hover:text-red-600 transition-colors ml-auto"
            title="Delete note">
                <Trash2 size={16}/>
            </button>
        </div>
      
    </div>
  )
}

export default NoteCard;
