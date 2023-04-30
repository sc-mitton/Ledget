import React from 'react'
import NewItemsStack from './NewItems'

import Plus from '../../assets/images/Plus'
import Funnel from '../../assets/images/Funnel'
import './Items.css'

function Items() {

    const Header = () => {
        return (
            <div className="window-header">
                <div>
                    <h2>Items</h2>
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

    return (
        <div>
            <NewItemsStack />
            <div className='window' id='items-window'>
                <Header />
            </div>
        </div>
    )
}

export default Items
