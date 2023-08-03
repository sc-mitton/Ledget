import React from 'react'

import './styles/window.css'

const Gutter = () => {
    return (
        <div id="gutter">
            Hello There
        </div>
    )
}

const Settings = () => {
    return (
        <div className="content">
            <div className='window-header'>
                <h1>Settings</h1>
            </div>
        </div>
    )
}

function Profile() {
    return (
        <div className="window" id="settings-window">
            <Gutter />
            <Settings />
        </div>
    )
}

export default Profile
