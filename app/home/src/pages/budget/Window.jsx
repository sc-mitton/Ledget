import React from 'react'

import { Route, Routes } from 'react-router-dom'

import Header from './Header'
import './styles/Window.css'

function Main() {
    return (
        <></>
    )
}

function Window() {

    return (
        <div className="window" id="budget-window">
            <Header />
            <Routes>
                <Route path="new" element={<div>new</div>} />
                <Route path="edit" element={<div>edit</div>} />
                <Route path="/" element={<Main />} />
            </Routes>
        </div>
    )
}

export default Window
