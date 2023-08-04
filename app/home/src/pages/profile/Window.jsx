import React from 'react'

import { Routes, Route } from 'react-router-dom'

import './styles/Window.css'
import Gutter from './Gutter'
import Account from './Account'
import Institutions from './Institutions'
import Settings from './Settings'
import Security from './Security'

function Profile() {
    return (
        <div className="window" id="profile-window">
            <Gutter />
            <Routes>
                <Route path="" element={<Account />} />
                <Route path="settings" element={<Settings />} />
                <Route path="institutions" element={<Institutions />} />
                <Route path="security" element={<Security />} />
            </Routes>
        </div>
    )
}

export default Profile
