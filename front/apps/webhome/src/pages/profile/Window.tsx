import { createContext, useContext, ReactNode, useState } from 'react'

import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import './styles/window.scss'
import Gutter from './Gutter'
import AccountPage from './Account'
import ConnectionsPage from './Connections'
import { SecurityPage } from './SecurityPage'
import {
    UpdatePayment,
    CancelSubscription,
    ChangeBillCycle,
    DeactivateAuthentictor,
    ChangePassword,
    AuthenticatorSetup,
    RecoveryCodes
} from '@modals/index'
import { useGetMeQuery } from '@features/userSlice'
import { ShimmerDiv } from '@ledget/ui'
import { useScreenContext } from '@context/context'

const GutterContext = createContext<[
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
] | undefined>(undefined)

export const useGutterContext = () => {
    const context = useContext(GutterContext)
    if (context === undefined) {
        throw new Error('useGutterContext must be used within a GutterProvider')
    }
    return context
}

const GutterProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false)

    return (
        <GutterContext.Provider value={[open, setOpen]}>
            {children}
        </GutterContext.Provider>
    )
}

function Profile() {
    const { isLoading: userLoading } = useGetMeQuery()
    const location = useLocation()
    const [open] = useGutterContext()
    const { screenSize } = useScreenContext()

    return (
        <div id="profile-window--container" className='main-window'>
            <ShimmerDiv
                className={`window
                ${open ? 'with-open-gutter' : ''}
                ${screenSize === 'small' ? 'small-screen' : ''}`}
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
                        className="content"
                    >
                        <Routes location={location} key={location.pathname.split('/')[2]}>
                            <Route path="details" element={<AccountPage />} >
                                <Route path="update-payment" element={<UpdatePayment />} />
                                <Route path="cancel-subscription" element={<CancelSubscription />} />
                                <Route path="change-bill-cycle" element={<ChangeBillCycle />} />
                            </Route>
                            <Route path="connections" element={<ConnectionsPage />} />
                            <Route path="security" element={<SecurityPage />} >
                                <Route path="delete-authenticator" element={<DeactivateAuthentictor />} />
                                <Route path="authenticator-setup" element={<AuthenticatorSetup />} />
                                <Route path="change-password" element={<ChangePassword />} />
                                <Route path="recovery-codes" element={<RecoveryCodes />} />
                            </Route>
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </ShimmerDiv>
        </div>
    )
}

export default function () {
    return (
        <GutterProvider>
            <Profile />
        </GutterProvider>
    )
}
