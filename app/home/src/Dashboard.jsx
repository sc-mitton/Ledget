import React from 'react'

import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Budget from '@pages/budget/Window'
import Spending from '@pages/Spending'
import Profile from '@pages/Profile'
import Accounts from '@pages/Accounts'
import './styles/dashboard.css'

const Dashboard = ({ isNarrow }) => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                id="dashboard"
                initial={{ opacity: 0, transform: 'scale(0.98)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0.98)' }}
                key={location.pathname}
                transition={{
                    opacity: { duration: .25, ease: "easeOut" }
                }}
            >
                <Routes location={location} key={location.pathname} >
                    <Route path="budget/*" element={
                        <>
                            <Budget />
                            {!isNarrow && <Spending />}
                        </>
                    } />
                    <Route path="spending" element={<Spending />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="profile" element={<Profile />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

export default Dashboard
