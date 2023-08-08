import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Routes from './Routes'
import "./style/portal.css"

function App() {

    return (
        <main>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </main >
    )
}

export default App
