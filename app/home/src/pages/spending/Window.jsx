import React from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from '../needsConfirmation/Window'
import Plus from '@assets/icons/Plus'
import Funnel from '@assets/icons/Funnel'


const HistoryHeader = () => {
    return (
        <div className="window-header">
            <div>
                <h2>History</h2>
            </div>
            <div className="header-btns">
                <button
                    className="btn-clr btn"
                    id="funnel-icon"
                    aria-label="Filter items"
                >
                    <Funnel />
                </button>
                <button
                    className="btn-clr btn"
                    id="add-icon"
                    aria-label="Manually add item"
                >
                    <Plus />
                </button>
            </div>
        </div>
    )
}

function Spending() {

    return (
        <div id="spending-window">
            <NeedsConfirmationWindow />
            <div className="window" id="all-items-window">
                <HistoryHeader />
            </div>
        </div>
    )
}

export default Spending
