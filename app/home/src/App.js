import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

import Dashboard from './Dashboard'

function App() {

    return (
        <main tabIndex={0}>
            <UserProvider>
                <BrowserRouter>
                    <Dashboard />
                </BrowserRouter>
            </UserProvider>
        </main >
    )
}

export default App
