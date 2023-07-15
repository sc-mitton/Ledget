import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import AnimatedRoutes from './AnimatedRoutes'
import { UserProvider } from './context/UserContext'
import "./style/portal.css"

function App() {

    return (
        <main>
            <BrowserRouter>
                <UserProvider>
                    <AnimatedRoutes />
                </UserProvider>
            </BrowserRouter>
        </main >
    )
}

export default App
