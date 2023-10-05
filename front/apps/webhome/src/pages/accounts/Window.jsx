import React, { useEffect, useRef } from 'react'

import { Outlet, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { animated } from '@react-spring/web'

import './styles/Window.css'
import NotFound from '@pages/notFound/NotFound'
import { usePillAnimation } from '@utils/hooks'
import { DepositsIcon, ClockIcon, StocksIcon, CardIcon } from '@ledget/shared-assets'

const Header = () => {
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { props } = usePillAnimation({
        ref: ref,
        update: [location.pathname],
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

    return (
        <div>
            <div className='window-header'>
                <h1>Accounts</h1>
            </div>
            <div style={{ padding: 'var(--padding1)' }}>
                <ul ref={ref}>
                    {paths.map((path) => (
                        <li
                            key={path.path}
                            className='window-header--item btn-icon-l'
                            role='link'
                            aria-current={currentPath === path.path ? 'page' : null}
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
        </div>
    )
}

function Window() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/accounts/deposits')
    }, [])

    return (
        <div className="window" id="accounts-window">
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route path="deposits" element={<div>Deposits</div>} />
                    <Route path="investments" element={<div>Investments</div>} />
                    <Route path="credit" element={<div>Credit</div>} />
                    <Route path="loans" element={<div>Loans</div>} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    )
}

export default Window
