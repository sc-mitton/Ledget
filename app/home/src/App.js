import React from 'react'

import { BrowserRouter } from 'react-router-dom'

import Dashboard from './pages/Dashboard'

function App() {

    return (
        <main tabIndex={0}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </main >
    )
}

export default App
