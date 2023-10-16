import { useEffect, useRef, useState } from 'react'

import { Outlet, Routes, Route, useNavigate, useLocation, Location } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'

import './styles/Window.css'
import './styles/Main.css'
import NotFound from '@pages/notFound/NotFound'
import { usePillAnimation } from '@utils/hooks'
import TransactionItem from '@modals/TransactionItem'
import { DepositsIcon, ClockIcon, StocksIcon, CardIcon } from '@ledget/media'
import { useGetAccountsQuery } from "@features/accountsSlice"
import Deposits from './Deposits'

const getNavIcon = (key = '', isCurrent: boolean) => {
    const fill = isCurrent ? 'var(--green-dark4)' : 'currentColor'

    switch (key) {
        case 'deposits':
            return <DepositsIcon fill={fill} />
        case 'credit':
            return <CardIcon fill={fill} />
        case 'investments':
            return <StocksIcon fill={fill} />
        case 'loans':
            return <ClockIcon fill={fill} />
        default:
            return null
    }
}

const getNavLabel = (key = '') => {
    switch (key) {
        case 'deposits':
            return 'Deposits'
        case 'credit':
            return 'Credit'
        case 'investments':
            return 'Investments'
        case 'loans':
            return 'Loans'
        default:
            return null
    }
}

const Header = () => {
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const [windowWidth, setWindowWidth] = useState(0)
    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname, windowWidth],
        querySelectall: '[role=link]',
        find: (element) => element.getAttribute('aria-current') === 'true',
        styles: {
            backgroundColor: 'var(--green-hlight2)',
            borderRadius: 'var(--border-radius3)',
        }
    })
    const currentPath = location.pathname.split('/')[location.pathname.split('/').length - 1]


    // Resize observer to update nav pill when responsive layout changes
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width
                setWindowWidth(newWidth)
            }
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <div className='window-header'>
                <h2>Your Accounts</h2>
            </div>
            <div id="accounts-header-nav">
                <ul ref={ref}>
                    {['deposits', 'credit', 'loans', 'investments'].map((path) => (
                        <li
                            key={path}
                            className='window-header--item btn-icon-l'
                            role='link'
                            aria-current={currentPath === path}
                            tabIndex={0}
                            onClick={() => navigate(`/accounts/${path}`)}
                        >
                            {getNavIcon(path, currentPath === path)}
                            {getNavLabel(path)}
                        </li>
                    ))
                    }
                    <animated.span style={props} />
                </ul>
                <Outlet />
            </div>
        </>
    )
}

function Window() {
    const navigate = useNavigate()
    const location = useLocation()
    useGetAccountsQuery()

    useEffect(() => {
        navigate('/accounts/deposits')
    }, [])

    return (
        <div className="window" id="accounts-window">
            <Header />
            <AnimatePresence mode="wait">
                <motion.div
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
                    <Routes
                        location={location}
                        key={location.pathname.split('/')[2]}
                    >
                        <Route path="deposits" element={<Deposits />} >
                            <Route path="transaction/:id" element={<TransactionItem />} />
                        </Route>
                        <Route path="investments" element={<div>Investments</div>} />
                        <Route path="credit" element={<div>Credit</div>} />
                        <Route path="loans" element={<div>Loans</div>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Window
