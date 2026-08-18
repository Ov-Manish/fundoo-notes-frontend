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


// INITIAL STATE 

const initialState = {
    notes : [],
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
            });
            
    },
});

export const {clearNotes}= noteSlice.actions;
export default noteSlice.reducer;