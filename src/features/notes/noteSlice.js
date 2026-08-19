import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

//  Dynamic Api End Point 

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/notes`



// Helper method for Authenticate the JWT TOKEN
const getAuthHeaders = ()=>{
    const token = localStorage.getItem('token');

    return{
        headers : {
                Authorization : `Bearer ${token}`,
                'Content-type' : 'application/json'
        },
    };
};


// Async Thunks (API CALLS)

// Fetch all notes for the authenticated user

export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async(_,{rejectWithValue}) =>{
        try {
            const response = await axios.get(`${API_URL}/all` , getAuthHeaders());
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || `Failed to Fetch notes. Server Oflline `
            );
        }
    }
);



//  Create a New Note 

export const addNotes = createAsyncThunk(
    'notes/addNote',
    async(noteData , {rejectWithValue}) =>{
        try {
            const response = await axios.post(`${API_URL}/create` , noteData , getAuthHeaders());
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unable to Create New Note"
            );
        }
    }
);


// Soft - Delete a Note (Move to Trash)
export const trashNote = createAsyncThunk(
    'notes/trashNote',
    async (noteId , {rejectWithValue}) =>{
        try {
            await axios.delete(`${API_URL}/${noteId}`,getAuthHeaders());
            return noteId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to move note to trash.'
            );
        }
    }
);


// Restore a Soft - Deleted note from Trash
export const restoreNote = createAsyncThunk(
    'notes/restoreNote',
    async (noteId , {rejectWithValue}) =>{
        try {
            const response = await axios.put(`${API_URL}/undo/${noteId}`, {} , getAuthHeaders());
            return response.data;  // returned the restored note object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to Restore Note.'
            );
        }
    }
);

// Update an existing note
export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ noteId, noteData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/update/${noteId}`, noteData, getAuthHeaders());
            return response.data; // Returned the updated note object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to Update Note.'
            );
        }
    }
);


// Fetch All Soft - deleted notes for the Trash Bin

export const fetchTrashedNotes = createAsyncThunk(
    'notes/fetchTrashNotes',
    async(_,{rejectWithValue}) =>{
        try {
            const response = await axios.get(`${API_URL}/trash`,getAuthHeaders());
            return response.data; // Array of Soft - deleted notes
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load trashed notes.'
            );
        }
    }
);

// Toggle Note Archive Status (Archive / Unarchive)
export const toggleArchiveNote = createAsyncThunk(
    'notes/toggleArchiveNote',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/archive/${noteId}`, {}, getAuthHeaders());
            return response.data; // Returned the updated note object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to Archive/Unarchive Note.'
            );
        }
    }
);

// Fetch All Archived Notes
export const fetchArchivedNotes = createAsyncThunk(
    'notes/fetchArchivedNotes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/archive`, getAuthHeaders());
            return response.data; // Array of Archived notes
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load archived notes.'
            );
        }
    }
);


// INITIAL STATE 

const initialState = {
    notes : [],
    trashedNotes : [],
    archivedNotes : [], // 👈 Storing archived notes in state
    loading : false,
    error : null,
};

// NOTES SLICE 

const noteSlice = createSlice({
    name : "notes",
    initialState,
    reducers : {
        clearNotes : (state)=>{
            state.notes = [];
            state.error = null;
        },
    },

    extraReducers : (builder)=>{
        builder  // Fetch NOTES
        .addCase(fetchNotes.pending , (state) =>{ 
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchNotes.fulfilled,(state,action) =>{
            state.loading = false;
            state.notes = action.payload;
        })
        .addCase(fetchNotes.rejected , (state , action) =>{
            state.loading = false;
            state.error = action.payload;
        })


            // Add NOTES

            .addCase(addNotes.pending , (state)=>{
                state.loading = true;
            })
            .addCase(addNotes.fulfilled,(state,action)=>{
                state.loading = false;
                // Immer Allows us to safely push the new note straight into state
                state.notes.push(action.payload)
            })
            
            .addCase(addNotes.rejected,(state,action)=>{
                state.loading = false;
                // Immer Allows us to safely push the new note straight into state
                state.error = action.payload;
            })


            // Trash Notes
            .addCase(trashNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(trashNote.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = state.notes.filter((note) => note.id !== action.payload);
                state.archivedNotes = state.archivedNotes.filter((note) => note.id !== action.payload);
            })
            .addCase(trashNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Restore Notes
            .addCase(restoreNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreNote.fulfilled, (state, action) => {
                state.loading = false;
                state.trashedNotes = state.trashedNotes.filter((note) => note.id !== action.payload.id);
                state.notes.push(action.payload);
            })
            .addCase(restoreNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Trashed Notes
            .addCase(fetchTrashedNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrashedNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.trashedNotes = action.payload;
            })
            .addCase(fetchTrashedNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Note
            .addCase(updateNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.notes.findIndex((note) => note.id === action.payload.id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Toggle Archive
            .addCase(toggleArchiveNote.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleArchiveNote.fulfilled, (state, action) => {
                state.loading = false;
                const updatedNote = action.payload;
                const isArchived = updatedNote.isArchived !== undefined ? updatedNote.isArchived : updatedNote.archived;
                
                if (isArchived) {
                    // If note was archived, remove from active and push to archived
                    state.notes = state.notes.filter((note) => note.id !== updatedNote.id);
                    state.archivedNotes.push(updatedNote);
                } else {
                    // If note was unarchived, remove from archived and push to active
                    state.archivedNotes = state.archivedNotes.filter((note) => note.id !== updatedNote.id);
                    state.notes.push(updatedNote);
                }
            })
            .addCase(toggleArchiveNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Archived Notes
            .addCase(fetchArchivedNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArchivedNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.archivedNotes = action.payload;
            })
            .addCase(fetchArchivedNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
    },
});

export const {clearNotes}= noteSlice.actions;
export default noteSlice.reducer;