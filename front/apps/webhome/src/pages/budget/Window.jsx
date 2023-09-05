import React from 'react'

import './styles/Window.css'
import Header from './Header'
import Budget from './Budget'

function Window() {
    return (
        <div className="window" id="budget-window">
            <Header />
            <Budget />
        </div>
    )
}

export default Window
