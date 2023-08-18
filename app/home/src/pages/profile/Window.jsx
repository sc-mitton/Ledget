import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import './styles/window.css'
import Gutter from './Gutter'
import Account from './Account'
import Connections from './Connections'
import Settings from './Settings'
import Security from './Security'
import { useGetMeQuery } from '@api/apiSlice'
import { ShimmerDiv } from '@components/pieces'

function Profile() {
    const { isLoading: userLoading } = useGetMeQuery()
    const location = useLocation()

    return (
        <ShimmerDiv
            className="window"
            id="profile-window"
            shimmering={userLoading}
        >
            {!userLoading &&
                <>
                    <Gutter />
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={location.pathname}
                            config={{ duration: 0.2 }}
                            className="content"
                        >
                            <Routes location={location} key={location.pathname}>
                                <Route path="" element={<Account />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="connections" element={<Connections />} />
                                <Route path="security" element={<Security />} />
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </>
            }
        </ShimmerDiv>
    )
}

export default Profile
