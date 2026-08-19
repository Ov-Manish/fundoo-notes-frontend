import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';


// BASE URL 
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;



// ASYNC THUNKS (API CALLS)

// Thunk for User Registraion 
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(userData , {rejectWithValue}) =>{
        try {
            const response = await axios.post(`${API_URL}/register` , userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || `Registration Failed. Please Try Again.`
            );
        }
    }
);

// Thunk For User Login

export const loginUser = createAsyncThunk(
    'auth/login',
    async(credentials , { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login` , credentials);
            if (response.data.token) {
                localStorage.setItem('token',response.data.token);
                const userObj = response.data.user || { email: credentials.email };
                localStorage.setItem('user',JSON.stringify(userObj));
            }

            return response.data; // returning the response
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || `Login Failed. INVALID email or password`
            );
        }
    }
)


// INITIAL STATE : 

const token = localStorage.getItem('token') || null;
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
    user : user,
    token : token,
    loading : false,
    error : null,
    success : false,
}


// THE AUTH SLICER 👍

const authSlice = createSlice({
    name : `auth`,
    initialState,
    reducers : {
        logout : (state)=>{ // Logout Reducer
            state.user = null,
            state.token = null,
            state.success = false,
            state.error = null,
            localStorage.removeItem(`token`)
            localStorage.removeItem(`user`)  
        },

        clearError : (state) =>{
            state.error = null;
        },
        
        resetSuccess : (state) =>{
            state.success = false;
        }
    },

    extraReducers : (builder) =>{
        builder

        // FOR REGISTRATION 
            .addCase(registerUser.pending , (state)=>{
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled , (state)=>{
                state.loading = false;
                state.success = true;
            })
            .addCase(registerUser.rejected , (state , action)=>{
                state.loading = false;
                state.error = action.payload;
            })


            // FOR LOGIN

            .addCase(loginUser.pending , (state) =>{
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled  , (state , action)=>{
                state.loading = false;
                state.success = true;
                state.token = action.payload.token;
                state.user = action.payload.user || { email: action.meta.arg.email }; 
            })
            .addCase(loginUser.rejected , (state , action)=>{
                state.loading = false;
                state.error = action.payload;
            });
    }
});


export const {logout,clearError , resetSuccess} = authSlice.actions;
export default authSlice.reducer;




