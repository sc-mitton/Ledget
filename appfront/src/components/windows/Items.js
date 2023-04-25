import React from 'react'
import NewItemsStack from './NewItems'

function Items() {

    const Header = () => {
        return (
            <div className="window-header">
                <h2>Items</h2>
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
