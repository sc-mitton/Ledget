import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import './styles/window.css'
import Gutter from './Gutter'
import AccountPage from './Account'
import ConnectionsPage from './Connections'
import SettingsPage from './Settings'
import SecurityPage from './Security'
import {
    UpdatePayment,
    CancelSubscription,
    ChangeBillCycle
} from '@modals'
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
                        <Route path="details" element={<AccountPage />} >
                            <Route path="update-payment" element={<UpdatePayment />} />
                            <Route path="cancel-subscription" element={<CancelSubscription />} />
                            <Route path="change-bill-cycle" element={<ChangeBillCycle />} />
                        </Route>
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="connections" element={<ConnectionsPage />} />
                        <Route path="security" element={<SecurityPage />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </ShimmerDiv>
    )
}

export default Profile
