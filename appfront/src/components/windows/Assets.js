import React from 'react'

function Assets() {

    const Header = () => {
        return (
            <div className="window-header">
                <h3>Assets</h3>
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
