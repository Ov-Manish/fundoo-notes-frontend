import { LogIn } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import {BrowserRouter , Routes , Route , Navigate} from 'react-router-dom'
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "../routes/PrivateRoute"



const AppRoutes = () => {

    const {token} = useSelector((state)=> state.auth)

  return (
    <BrowserRouter>
        <Routes>
          {/* LOGIN */}
            <Route 
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login/>}
            />

            {/* REGISTER */}
            <Route 
            path="/register"
            element={token ? <Navigate to="/dashboard" replace /> : <Register/>}
            />

            {/* PROTECTED DASHBOARD ROUTE */}

            <Route 
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard/>
                </PrivateRoute>
              }
            />

            <Route 
              path="*"
              element={<Navigate  to={token ? "/dashboard" : "/login"} replace/>} 
            />

        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
