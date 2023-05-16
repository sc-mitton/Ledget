import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import Header from './components/Header'

function App() {
    return (
        <main tabIndex={0}>
            <BrowserRouter>
                <Header />
                <Routes >
                    <Route path="/" exact element={<Home />} />
                </Routes >
            </BrowserRouter>
        </main >
    )
}

export default App
