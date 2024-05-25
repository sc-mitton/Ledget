import { useState, useRef, useEffect } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'
import { animated } from '@react-spring/web'
import Big from 'big.js'

import './styles/Wafers.scss'
import {
    DollarCents,
    useScreenContext,
    IconButton3,
    useIsMount,
    Window2
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

const WaferList = ({ collapsed }: { collapsed: boolean }) => {
    const isMounted = useIsMount()
    const location = useLocation()
    const { accounts } = useAccountsContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const { transitions, bind, collapse, click } = useAnimate({
        waferWidth: location.pathname.includes('credit') ? creditWaferWidth : waferWidth,
        accounts,
        waferPadding
    })

    const handleClick = (id: string) => {
        searchParams.set('account', id)
        setSearchParams(searchParams)
        click(id)
    }

    useEffect(() => {
        if (!isMounted) {
            collapse(collapsed)
        }
    }, [collapsed])

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
    const ref = useRef<HTMLDivElement>(null)
    const [key, setKey] = useState(Math.random().toString().slice(2, 8))
    const [showChart, setShowChart] = useState(false)

    useEffect(() => {
        setKey(Math.random().toString().slice(2, 8))
    }, [accounts])

    return (
        <>
            <div className={`${'account-wafers-container'} ${screenSize}`} ref={ref} key={key}>
                <Window2>
                    <div>
                        <div>
                            <h4>{pathMappings.getWaferTitle(location)}</h4>
                            {location.pathname.includes('deposits') &&
                                <IconButton3
                                    aria-label='Show balance history'
                                    aria-haspopup='true'
                                    aria-expanded={showChart}
                                    aria-controls='balance-history'
                                    onClick={() => setShowChart(!showChart)}
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
                        : <WaferList collapsed={showChart} />}
                </Window2>
                {showChart && <Window2><BalanceChart /></Window2>}
            </div>
        </>
    )
}

export default Wafers
