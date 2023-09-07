import React from 'react'

import { Outlet } from 'react-router-dom'

import './styles/Window.css'
import Header from './Header'
import Budget from './Budget'

function Window() {
    return (
        <>
            <div className="window" id="budget-window">
                <Header />
                <Budget />
            </div>
            <Outlet />
        </>
    )
}

export default Window
