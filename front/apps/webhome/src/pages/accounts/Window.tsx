import { useEffect, useRef, useState } from 'react'

import { Outlet, Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'

import './styles/Window.css'
import './styles/Main.scss'
import Deposits from './DepositsTab'

import NotFound from '@pages/notFound/NotFound'
import { usePillAnimation } from '@utils/hooks'
import TransactionItem from '@modals/TransactionItem'
import { RefreshButton } from '@ledget/ui'
import { DepositsIcon, ClockIcon, StocksIcon, CardIcon } from '@ledget/media'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'

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

const getNavHeaderPhrase = (key = '') => {
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

const Header = () => {
    const ref = useRef(null)
    const [windowWidth, setWindowWidth] = useState(0)
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const currentPath = location.pathname.split('/')[location.pathname.split('/').length - 1]

    const [syncTransactions, {
        isSuccess: isTransactionsSyncSuccess,
        isError: isTransactionsSyncError,
        data: syncResult,
        isLoading: isSyncing
    }] = useTransactionsSyncMutation()
    const {
        data: accountsData,
        isSuccess: isSuccessLoadingAccounts
    } = useGetAccountsQuery()

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

    // Dispatch synced toast
    useEffect(() => {
        if (isTransactionsSyncSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
                timer: syncResult?.added ? 2500 : 2000,
                hasLoadingBar: false
            }))
        }
    }, [isTransactionsSyncSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isTransactionsSyncError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
                timer: 2500,
                hasLoadingBar: false
            }))
        }
    }, [isTransactionsSyncError])

    return (
        <>
            <div className='window-header'>
                <h2>{getNavHeaderPhrase(currentPath)}</h2>
                {isSuccessLoadingAccounts && accountsData?.accounts.length > 0 &&
                    <div className='refresh-btn--container' >
                        <RefreshButton
                            loading={isSyncing}
                            onClick={() => {
                                const account = searchParams.get('account')
                                if (account) {
                                    syncTransactions(account)
                                }
                            }}
                        />
                    </div>}
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
                            <Route path="transaction" element={<TransactionItem />} />
                        </Route>
                        <Route path="investments" element={<div>Investments</div>} />
                        <Route path="credit" element={<div>Credit</div>} />
                        <Route path="loans" element={<div>Loans</div>} />
                        <Route path="*" element={<NotFound hasBackground={false} />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Window
