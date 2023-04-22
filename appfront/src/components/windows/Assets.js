import React from 'react'

function Assets() {

    const Header = () => {
        return (
            <div className="window-header">
                <h2>Assets</h2>
            </div>
        )
    }

    return (
        <div className='window' id='assets-window'>
            <Header />
        </div>
    )
}

export default Assets
