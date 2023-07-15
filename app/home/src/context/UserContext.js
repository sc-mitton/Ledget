import React, { createContext, useEffect, useState } from "react"

import { ory } from "../api/ory"
import { ledget } from "../api/ledget"

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [flow, setFlow] = useState(null)

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

    useEffect(() => {
        sessionStorage.setItem('flow', JSON.stringify(flow))
    }, [flow])

    const getLogoutFlow = async () => {
        try {
            console.log("Logging out")
            const { data: flow } = await ory.createBrowserLogoutFlow()
            setFlow(flow)
        }
        catch (err) {
            console.log(err)
        }
    }

    const logout = async () => {
        try {
            !flow && await getLogoutFlow()
            setUser(null)
            setFlow(null)
            await ory.updateLogoutFlow({ token: flow.logout_token })
            window.location.href = process.env.REACT_APP_LOGOUT_REDIRECT_URL
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <UserContext.Provider value={{ user, getLogoutFlow, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
