import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import AnimatedRoutes from './AnimatedRoutes'
import "./style/portal.css"

function App() {

    return (
        <main>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
        </main >
    )
}

export default App
