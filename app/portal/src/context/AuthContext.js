import React from 'react'
import { createContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    // The context data is what is passed to the child components
    const contextData = {
        user,
        setUser,
    }

    useEffect(() => {
        setUser(sessionStorage.getItem('user' || null))
        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
