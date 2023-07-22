import React from 'react'
import { createContext, useState, useEffect } from "react"

const UserContext = createContext()
export default UserContext

export const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    // The context data is what is passed to the child components
    const contextData = {
        user,
        setUser,
    }

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem('user' || null)))
        setLoading(false)
    }, [])

    return (
        <UserContext.Provider value={contextData}>
            {loading ? null : children}
        </UserContext.Provider>
    )
}
