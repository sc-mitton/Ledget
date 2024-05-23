import { useState, useRef } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'
import { animated } from '@react-spring/web'
import Big from 'big.js'

import {
    DollarCents,
    CloseButton,
    useScreenContext,
    IconButton3,
} from '@ledget/ui'
import { LineGraph } from '@ledget/media'
import { useAccountsContext } from '../context'
import { BalanceChart } from '../BalanceChart'
import useAnimate from './useAnimate'
import DepositAccountWafer from './DepositsAccountWafer'
import SkeletonWafers from './SkeletonWafers'
import pathMappings from '../path-mappings'

const waferWidth = 165
const waferPadding = 6

const Wafers = () => {
    const { accounts } = useAccountsContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const { transitions, bind, waferApi } = useAnimate({ accounts, waferWidth, waferPadding })

    const handleClick = (id: string) => {
        searchParams.set('account', id)
        setSearchParams(searchParams)
        waferApi.start((index: any, item: any) => {
            if (item._item.account_id === id) {
                return ({
                    to: async (next: any) => {
                        await next({ scale: .95 })
                        await next({ scale: 1 })
                    },
                    config: { duration: 100 }
                })
            }
        })
    }

    return (
        <div className='account-wafers'>
            {transitions((style, account) => (
                account &&
                <animated.div
                    style={style}
                    className='account-wafer-container'
                    {...bind(account.account_id)}
                >
                    <DepositAccountWafer account={account} onClick={handleClick} />
                </animated.div>
            ))}
        </div>
    )
}

function AccountWafers() {
    const location = useLocation()
    const { accounts } = useAccountsContext()
    const { screenSize } = useScreenContext()
    const { isLoading: isLoadingAccounts } = useAccountsContext()
    const [showBalanceHistory, setShowBalanceHistory] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div className={`${'account-wafers-container'} ${screenSize}`} ref={ref}>
            <div>
                <div>
                    <h4>{pathMappings.getWaferTitle(location)}</h4>
                    {!showBalanceHistory && location.pathname.includes('deposits') &&
                        <IconButton3
                            onClick={() => setShowBalanceHistory(true)}
                            aria-label='Show balance history'
                            aria-haspopup='true'
                            aria-expanded={showBalanceHistory}
                            aria-controls='balance-history'
                        >
                            <LineGraph />
                        </IconButton3>}
                </div>
                <h1>
                    <DollarCents value={accounts?.reduce((acc, account) =>
                        acc.plus(account.balances.current), Big(0)).times(100).toNumber() || 0} />
                </h1>
            </div>
            {isLoadingAccounts
                ? <SkeletonWafers
                    count={ref.current?.offsetWidth ? Math.floor(ref.current.offsetWidth / waferWidth) - 1 : 0}
                    width={waferWidth}
                />
                : <Wafers />}
            {showBalanceHistory && <CloseButton onClick={() => setShowBalanceHistory(false)} />}
            {showBalanceHistory && <BalanceChart color={'--m-text'} />}
        </div>
    )
}

export default AccountWafers
