import React from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from '../needsConfirmation/Window'
import Plus from '@assets/icons/Plus'
import Funnel from '@assets/icons/Funnel'
import { Tooltip } from '@components/pieces'

const HistoryHeader = () => {
    return (
        <div className="window-header">
            <div>
                <h2>History</h2>
            </div>
            <div className="header-btns">
                <Tooltip
                    msg="Filter"
                    ariaLabel="Filter"
                    type="top"
                    style={{ left: '-.4rem' }}
                >
                    <button
                        className="btn-clr btn"
                        id="funnel-icon"
                        aria-label="Filter"
                    >
                        <Funnel />
                    </button>
                </Tooltip>
                <Tooltip
                    msg="Manually add item"
                    ariaLabel="Manually add item"
                    type="top"
                    style={{ left: '-2.5rem' }}
                >
                    <button
                        className="btn-clr btn"
                        id="add-icon"
                        aria-label="Manually add item"
                    >
                        <Plus />
                    </button>
                </Tooltip>
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
