import { useEffect, useRef, useState } from 'react'

import { Outlet, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'

import './styles/Window.css'
import './styles/Main.css'
import NotFound from '@pages/notFound/NotFound'
import { usePillAnimation } from '@utils/hooks'
import { TransactionItem } from '@modals'
import { DepositsIcon, ClockIcon, StocksIcon, CardIcon } from '@ledget/shared-assets'
import { useGetAccountsQuery } from "@features/accountsSlice"
import Deposits from './Deposits'


const Header = () => {
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const [windowWidth, setWindowWidth] = useState(0)
    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname, windowWidth],
        querySelectall: '[role=link]',
        find: (element) => element.getAttribute('aria-current') === 'page',
        styles: {
            backgroundColor: 'var(--green-hlight2)',
            borderRadius: 'var(--border-radius3)',
        }
    })
    const currentPath = location.pathname.split('/')[location.pathname.split('/').length - 1]
    const paths = [
        {
            path: 'deposits',
            label: 'Deposits',
            icon: <DepositsIcon fill={currentPath === 'deposits' && 'var(--green-dark4)'} />
        },
        {
            path: 'credit',
            label: 'Credit',
            icon: <CardIcon fill={currentPath === 'credit' && 'var(--green-dark4)'} />
        },
        {
            path: 'investments',
            label: 'Investments',
            icon: <StocksIcon fill={currentPath === 'investments' && 'var(--green-dark4)'} />
        },
        {
            path: 'loans',
            label: 'Loans',
            icon: <ClockIcon fill={currentPath === 'loans' && 'var(--green-dark4)'} />
        },
    ]


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
                    {paths.map((path) => (
                        <li
                            key={path.path}
                            className='window-header--item btn-icon-l'
                            role='link'
                            aria-current={currentPath === path.path ? 'page' : null}
                            tabIndex={0}
                            onClick={() => navigate(`/accounts/${path.path}`)}
                        >
                            {path.icon}
                            {path.label}
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

    const baseConfig = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }

    return (
        <div className="window" id="accounts-window">
            <Header />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname.split('/')[1]}
                    initial={{ opacity: 0, ...baseConfig }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Routes
                        path="/"
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
