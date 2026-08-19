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

// Create a new note reminder
export const createReminder = createAsyncThunk(
    'notes/createReminder',
    async (reminderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/reminders/create`,
                reminderData,
                getAuthHeaders()
            );
            return response.data; // Returned the created reminder object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to Create Reminder.'
            );
        }
    }
);

// Fetch all active reminders for the logged-in user
export const fetchActiveReminders = createAsyncThunk(
    'notes/fetchActiveReminders',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/reminders/active?email=${email}`,
                getAuthHeaders()
            );
            return response.data; // Array of active reminders
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to Load Reminders.'
            );
        }
    }
);

// Search notes using the backend SEARCH-SERVICE microservice
export const searchNotes = createAsyncThunk(
    'notes/searchNotes',
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/search?keyword=${keyword}`,
                getAuthHeaders()
            );
            return response.data; // Array of filtered notes from search-service
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to search notes.'
            );
        }
    }
);

// Fetch all labels belonging to the logged-in user
export const fetchLabels = createAsyncThunk(
    'notes/fetchLabels',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/labels/my-labels`,
                getAuthHeaders()
            );
            return response.data; // Array of labels
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load labels.'
            );
        }
    }
);

// Create a new label
export const createLabel = createAsyncThunk(
    'notes/createLabel',
    async (name, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/labels/create?name=${name}`,
                {},
                getAuthHeaders()
            );
            return response.data; // Created label object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create label.'
            );
        }
    }
);

// Rename an existing label
export const updateLabelName = createAsyncThunk(
    'notes/updateLabelName',
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/labels/${id}?name=${name}`,
                {},
                getAuthHeaders()
            );
            return response.data; // Renamed label object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to rename label.'
            );
        }
    }
);

// Delete a label entirely from the system
export const deleteLabel = createAsyncThunk(
    'notes/deleteLabel',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/labels/${id}`,
                getAuthHeaders()
            );
            return id; // Deleted label ID
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete label.'
            );
        }
    }
);


// INITIAL STATE 

const initialState = {
    notes : [],
    trashedNotes : [],
    archivedNotes : [], // 👈 Storing archived notes in state
    reminders: [],      // 👈 Storing active reminders in state
    searchQuery: '',    // 👈 Storing active search query
    searchResults: [],  // 👈 Storing search results from search-service
    labels: [],         // 👈 Storing user custom labels in state
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
        setSearchQuery : (state, action) => {
            state.searchQuery = action.payload;
        }
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

            // Create Reminder
            .addCase(createReminder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReminder.fulfilled, (state, action) => {
                state.loading = false;
                state.reminders.push(action.payload);
            })
            .addCase(createReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Active Reminders
            .addCase(fetchActiveReminders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveReminders.fulfilled, (state, action) => {
                state.loading = false;
                state.reminders = action.payload;
            })
            .addCase(fetchActiveReminders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search Notes
            .addCase(searchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Labels
            .addCase(fetchLabels.fulfilled, (state, action) => {
                state.labels = action.payload;
            })

            // Create Label
            .addCase(createLabel.fulfilled, (state, action) => {
                state.labels.push(action.payload);
            })

            // Update Label Name
            .addCase(updateLabelName.fulfilled, (state, action) => {
                const index = state.labels.findIndex((l) => l.id === action.payload.id);
                if (index !== -1) {
                    state.labels[index] = action.payload;
                }
            })

            // Delete Label
            .addCase(deleteLabel.fulfilled, (state, action) => {
                state.labels = state.labels.filter((l) => l.id !== action.payload);
            })
            
    },
});

export const { clearNotes, setSearchQuery } = noteSlice.actions;
export default noteSlice.reducer;