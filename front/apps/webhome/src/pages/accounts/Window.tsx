import { useLocation } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route } from 'react-router-dom'

import styles from './styles/Window.module.scss'
import './styles/Wafers.scss'
import { Nav } from './Nav'
import { useScreenContext } from '@ledget/ui'
import DepositsWafers from './accounstlist/DepositsWafers'
import Transactions from './Transactions'
import { NotImplimentedMessage } from '@components/pieces'
import NotFound from '@pages/notFound'
import { AccountsProvider } from './context'


const _getNavHeaderPhrase = (key = '') => {
    switch (key) {
        case 'deposits':
            return 'Your Accounts'
        case 'credit':
            return 'Your Credit Cards'
        case 'investments':
            return 'Your Investments'
        case 'loans':
            return 'Your Loans'
        default:
            return null
    }
}

const Window = () => {
    const { screenSize } = useScreenContext()
    const location = useLocation()
    const currentPath = location.pathname.split('/')[2]

    return (
        <div className={`main-window  ${screenSize === 'small' ? 'small' : ''} ${styles.window}`}>
            <h2>{_getNavHeaderPhrase(currentPath)}</h2>
            <Nav />
            <div>
                {!['small', 'extra-small'].includes(screenSize) &&
                    <Routes location={location}>
                        <Route path='deposits' element={<DepositsWafers />} />
                    </Routes>}
                <AnimatePresence mode="wait">
                    <motion.div
                        className={`${screenSize !== 'extra-small' ? 'window' : 'naked-window'}`}
                        key={location.pathname.split('/')[2]}
                        initial={{
                            opacity: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                        }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Routes location={location} key={location.pathname.split('/')[2]}>
                            <Route path="deposits" element={<Transactions />} />
                            <Route path="investments" element={<NotImplimentedMessage />} />
                            <Route path="credit" element={<Transactions />} />
                            <Route path="loans" element={<NotImplimentedMessage />} />
                            <Route path="*" element={<NotFound hasBackground={false} />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default function () {
    return (
        <AccountsProvider>
            <Window />
        </AccountsProvider>
    )
}
