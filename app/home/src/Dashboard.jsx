import React from 'react'

import { Routes, Route } from 'react-router-dom'

import Budget from './windows/Budget'
import Spending from './windows/Spending'
import Profile from './windows/Profile'
import Accounts from './windows/Accounts'
import './styles/dashboard.css'

const Dashboard = ({ isNarrow }) => {

    return (
        <div id="dashboard" >
            <Routes>
                <Route path="budget" element={
                    <>
                        <Budget />
                        {!isNarrow && <Spending />}
                    </>
                } />
                <Route path="spending" element={<Spending />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </div>
    )
}

export default Dashboard
