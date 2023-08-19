import React from 'react'

import { Outlet } from 'react-router-dom'

import './styles/Window.css'
import Header from './Header'

function Window() {
    return (
        <div className="window" id="budget-window">
            <Header />
            <Outlet />
        </div>
    )
}

export default Window
