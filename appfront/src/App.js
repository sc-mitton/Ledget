import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import Settings from './components/Settings'
import Header from './components/Header'

function App() {
    return (
        <main>
            <BrowserRouter>
                <Header />
                <Routes >
                    <Route path="/" exact element={<Home />} />
                    <Route path="settings" element={<Settings />} />
                </Routes >
            </BrowserRouter>
        </main >
    )
}

export default App
