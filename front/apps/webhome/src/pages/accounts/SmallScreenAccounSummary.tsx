import { useState } from 'react'

import { useLocation } from 'react-router-dom'
import Big from 'big.js'
import './styles/SmallScreenAccounSummary.scss'
import { DollarCents, CircleIconButton } from '@ledget/ui'
import { useAccountsContext } from './context'
import pathMappings from './path-mappings'
import { LineGraph, CloseIcon } from '@ledget/media'
import { BalanceHistory } from './BalanceHistory'

export const SummaryBox = () => {
    const { accounts } = useAccountsContext()
    const location = useLocation()
    const [showBalanceHistory, setShowBalanceHistory] = useState(false)

    return (
        <div id='small-screen-accounts-summary'>
            <div>
                <span>{pathMappings.getWaferTitle(location)}</span>
                <h1>
                    <DollarCents value={accounts?.reduce((acc, account) =>
                        acc.plus(account.balances.current), Big(0)).times(100).toNumber() || 0} />
                </h1>
            </div>
            {!showBalanceHistory && location.pathname.includes('deposits') &&
                <button
                    id='show-balance-history-button'
                    onClick={() => setShowBalanceHistory(true)}
                    aria-label='Show balance history'
                    aria-haspopup='true'
                    aria-expanded={showBalanceHistory}
                    aria-controls='balance-history'
                >
                    <LineGraph className='icon' />
                </button>}
            {showBalanceHistory &&
                <><CircleIconButton onClick={() => setShowBalanceHistory(false)}>
                    <CloseIcon />
                </CircleIconButton>
                    <BalanceHistory color={'--white'} /></>}
        </div>
    )
}
