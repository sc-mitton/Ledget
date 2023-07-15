import React, { createContext, useEffect, useState } from "react"

import { ory } from "../api/ory"

const route = (req) => {
    ory
        .createBrowserLogoutFlow({ cookie: req.header("cookie") })
        .then(({ data }) => {
            console.log(data.logout_url) // The logout URL
            console.log(data.logout_token) // The logout token

            // You can render the logout URL like so:
            // <a href="{{data.logout_url}}>Logout</a>

            // Or call the logout token:
            // kratos.updateLogoutFlow(data.logout_token).then(() => {
            // Logged out
            // })
        })
}

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }
