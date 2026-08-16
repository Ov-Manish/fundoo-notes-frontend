import React from 'react'
import {Navigate} from "react-router-dom"
import {useSelector} from "react-redux"

const PrivateRoute = ({children}) => {
    const {token} = useSelector((state)=> state.auth);

    //  If logged in , show the protected component. if not , redirect to /login.
        return token ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
