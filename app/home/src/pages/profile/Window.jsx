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
import { useGetMeQuery, useGetPaymentMethodQuery } from '@api/apiSlice'
import { LoadingShimmer } from '@components/pieces'

function Profile() {
    // Fetch necessary data
    const { data: user, isLoading: userLoading } = useGetMeQuery()
    const { isLoading: paymentLoading } = useGetPaymentMethodQuery(user?.id)
    const location = useLocation()

    return (
        <div className="window" id="profile-window">
            {userLoading || paymentLoading
                ?
                <LoadingShimmer visible={true} />
                :
                <>
                    <Gutter />
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={location.pathname}
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
        </div>
    )
}

export default Profile
