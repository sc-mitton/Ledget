import React from 'react'
import NewItemsWindow from '../components/NewItems'

import Plus from '../assets/svg/Plus'
import Funnel from '../assets/svg/Funnel'
import './styles/Items.css'


const HistoryHeader = () => {
    return (
        <div className="window-header">
            <div>
                <h2>History</h2>
            </div>
            <div className="window-header-buttons">
                <button
                    className="icon"
                    id="funnel-icon"
                    aria-label="Filter items"
                >
                    <Funnel />
                </button>
                <button
                    className="icon"
                    id="add-icon"
                    aria-label="Manually add item"
                >
                    <Plus />
                </button>
            </div>
        </div>
    )
}

function Items() {

    return (
        <div id="items-window">
            <NewItemsWindow />
            <div className='window' id="all-items-window">
                <HistoryHeader />
            </div>
        </div>
    )
}

export default Items
