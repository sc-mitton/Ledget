import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { useTransition, animated } from '@react-spring/web'

import Budget from './windows/Budget'
import Spending from './windows/Spending'
import Profile from './windows/Profile'
import Accounts from './windows/Accounts'
import './styles/dashboard.css'

const Dashboard = ({ isNarrow }) => {

    // const baseStyle = {
    //     boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    //     borderRadius: "12px",
    //     padding: "12px 20px",
    //     boxSizing: "border-box",
    // }

    // const transitions = useTransition(pages, {
    //     from: { opacity: 0, transform: 'scale(0.95)' },
    //     enter: { opacity: 1, transform: 'scale(1)', ...baseStyle },
    //     leave: { opacity: 0, transform: 'scale(0.95)' },
    //     config: {
    //         tension: 100,
    //         friction: 20,
    //         mass: 1,
    //     },
    // })

    return (
        <div id="dashboard">
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
