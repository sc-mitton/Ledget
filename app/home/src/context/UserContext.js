import React, { createContext, useEffect, useState } from "react"

import { ory } from "../api/ory"
import { ledget } from "../api/ledget"

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            ledget.get('/user/me')
                .then(res => {
                    setUser(res.data)
                })
                .catch(err => {
                    window.location.href = process.env.REACT_APP_LOGOUT_REDIRECT_URL
                })
        }
        getUser()
    }, [])

    useEffect(() => {
        sessionStorage.setItem('user', JSON.stringify(user))
    }, [user])

    const logout = async () => {
        try {
            console.log("Logging out")
            const { data: flow } = await ory.createBrowserLogoutFlow({
                returnTo: process.env.REACT_APP_LOGOUT_REDIRECT_URL
            })
            await ory.updateLogoutFlow({ token: flow.logout_token })
            setUser(null)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <UserContext.Provider value={{ user, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
