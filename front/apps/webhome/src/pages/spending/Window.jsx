import React from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from '../needsConfirmation/Window'
import { Plus, Funnel } from '@ledget/shared-assets'
import { IconButton, Tooltip } from '@ledget/shared-ui'

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
                    <IconButton
                        id="funnel-icon"
                        aria-label="Filter"
                    >
                        <Funnel />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    msg="Manually add item"
                    ariaLabel="Manually add item"
                    type="top"
                    style={{ left: '-2.5rem' }}
                >
                    <IconButton
                        id="add-icon"
                        aria-label="Manually add item"
                    >
                        <Plus />
                    </IconButton>
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
