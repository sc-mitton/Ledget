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
import UpdatePayment from '@modals/UpdatePayment'
import { useGetMeQuery } from '@features/userSlice'
import { ShimmerDiv } from '@ledget/shared-ui'

function Profile() {
    const { isLoading: userLoading } = useGetMeQuery()
    const location = useLocation()

    return (
        <ShimmerDiv
            className="window"
            id="profile-window"
            shimmering={userLoading}
        >
            <Gutter />
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={location.pathname.split('/')[2]}
                    config={{ duration: 0.2 }}
                    className="content"
                >
                    <Routes path="profile" location={location} key={location.pathname.split('/')[2]}>
                        <Route path="details" element={<Account />} >
                            <Route path="update-payment" element={<UpdatePayment />} />
                        </Route>
                        <Route path="settings" element={<Settings />} />
                        <Route path="connections" element={<Connections />} />
                        <Route path="security" element={<Security />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </ShimmerDiv>
    )
}

export default Profile
