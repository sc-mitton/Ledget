import { useEffect, useRef, useState } from 'react'

import { Outlet, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'framer-motion'

import './styles/Window.scss'
import './styles/Main.scss'
import Transactions from './Transactions'
import { CreditCard, Clock, TrendingUp } from '@geist-ui/icons'

import NotFound from '@pages/notFound/NotFound'
import { RefreshButton, usePillAnimation, useSchemeVar } from '@ledget/ui'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'
import { AccountWafers } from './AccountWafers'
import { NotImplimentedMessage } from '@components/pieces'
import { useScreenContext } from '@context/context'
import { DepositsIcon } from '@ledget/media'


const _getNavIcon = (key = '', isCurrent: boolean) => {

    switch (key) {
        case 'deposits':
            return <DepositsIcon stroke={'currentColor'} />
        case 'credit':
            return <CreditCard stroke={'currentColor'} className='icon' />
        case 'investments':
            return <TrendingUp stroke={'currentColor'} className='icon' />
        case 'loans':
            return <Clock stroke={'currentColor'} className='icon' />
        default:
            return null
    }
}

const _getNavLabel = (key = '') => {
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

const Header = () => {
    const ref = useRef(null)
    const [windowWidth, setWindowWidth] = useState(0)
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname.split('/')[2]
    const { screenSize } = useScreenContext()

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
    const [backgroundColor] = useSchemeVar(['--blue-medium'])

    const [props] = usePillAnimation({
        ref: ref,
        update: [location.pathname, windowWidth],
        querySelectall: '[role=link]',
        find: (element) => element.getAttribute('aria-current') === 'true',
        styles: {
            backgroundColor: backgroundColor,
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

        if (ref.current)
            observer.observe(ref.current)

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
            }))
        }
    }, [isTransactionsSyncSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isTransactionsSyncError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
            }))
        }
    }, [isTransactionsSyncError])

    return (
        <>
            <div className='window-header'>
                <h2>{_getNavHeaderPhrase(currentPath)}</h2>
            </div>
            <div id="accounts-header-nav">
                <ul ref={ref}>
                    {['deposits', 'credit', 'loans', 'investments'].map((path) => (
                        <li
                            key={path}
                            role='link'
                            aria-current={currentPath === path}
                            tabIndex={0}
                            onClick={() => location.pathname !== `/accounts/${path}` && navigate(`/accounts/${path}`)}
                        >
                            {_getNavIcon(path, currentPath === path)}
                            {screenSize !== 'extra-small' && <span>{_getNavLabel(path)}</span>}
                        </li>
                    ))
                    }
                    <animated.span style={props} />
                    {isSuccessLoadingAccounts && accountsData?.accounts.length > 0 &&
                        <RefreshButton
                            stroke={'var(--m-text)'}
                            loading={isSyncing}
                            onClick={() => {
                                syncTransactions({})
                            }}
                        />}
                </ul>
                <Outlet />
            </div>
        </>
    )
}

function Window() {
    const location = useLocation()
    const { screenSize } = useScreenContext()

    return (
        <div id="accounts-window" className={`main-window  ${screenSize === 'small' ? 'small' : ''}`}>
            <Header />
            <div>
                <AccountWafers />
                <AnimatePresence mode="wait">
                    <motion.div
                        className={`${screenSize !== 'extra-small' ? 'window' : 'window-no-background'}`}
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

export default Window
