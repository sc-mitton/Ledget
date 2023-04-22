import React from 'react'

function Items() {

    const Header = () => {
        return (
            <div className="window-header">
                <h2>Items</h2>
            </div>
        )
    }

    return (
        <div className='window' id='items-window'>
            <Header />
        </div>
    )
}

export default Items
