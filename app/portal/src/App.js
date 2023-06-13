import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import AnimatedRoutes from './AnimatedRoutes'
import { AuthProvider } from './context/AuthContext'
import "./style/portal.css"

function App() {

    console.log('mounting app')

    return (
        <main>
            <BrowserRouter>
                <AuthProvider>
                    <AnimatedRoutes />
                </AuthProvider>
            </BrowserRouter>
        </main >
    )
}

export default App
