import { useState, useRef } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'
import { animated } from '@react-spring/web'
import Big from 'big.js'

import './styles/Wafers.scss'
import {
    DollarCents,
    CloseButton,
    useScreenContext,
    IconButton3,
} from '@ledget/ui'
import { LineGraph } from '@ledget/media'
import { useAccountsContext } from '../context'
import { BalanceChart } from '../balance-chart/BalanceChart'
import useAnimate from './useAnimate'
import Wafer from './Wafer'
import SkeletonWafers from './SkeletonWafers'
import pathMappings from '../path-mappings'
import { WaferStyle } from './types'

const waferWidth = 165
const creditWaferWidth = 175
const waferPadding = 6

const WaferList = () => {
    const location = useLocation()
    const { accounts } = useAccountsContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const { transitions, bind, waferApi } = useAnimate({
        waferWidth: location.pathname.includes('credit') ? creditWaferWidth : waferWidth,
        accounts,
        waferPadding
    })

    const handleClick = (id: string) => {
        searchParams.set('account', id)
        setSearchParams(searchParams)

        // Click Animation
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
                    <Wafer
                        account={account}
                        onClick={handleClick}
                        styling={location.pathname.split('/')[2] as WaferStyle}
                    />
                </animated.div>
            ))}
        </div>
    )
}

function Wafers() {
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
                : <WaferList />}
            {showBalanceHistory && <CloseButton onClick={() => setShowBalanceHistory(false)} />}
            {showBalanceHistory && <BalanceChart color={'--m-text'} />}
        </div>
    )
}

export default Wafers
