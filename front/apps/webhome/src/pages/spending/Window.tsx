import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { shallowEqual } from 'react-redux'

import './styles/Window.scss'
import NeedsConfirmationWindow from './needsConfirmation/Window'
import HistoryWindow from './history/Window'
import { SpendingViewContextProvider } from './context'
import { useScreenContext } from '@context/context'
import { ExpandButton } from '@ledget/ui'
import { selectUnconfirmedTransactions } from '@features/transactionsSlice'
import { toggleSpendingSideBar, selectSpendingSideBarCollapsed } from '@features/uiSlice'
import { useAppSelector, useAppDispatch } from '@hooks/store'

const NeedsConfirmationIndicator = () => {
    const [searchParams] = useSearchParams()

    const unconfirmedTransactions = useAppSelector(
        state => selectUnconfirmedTransactions(state, {
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear()
        }), shallowEqual
    )

    return unconfirmedTransactions.length > 0 ? <span className="needs-confirmation-indicator" /> : <></>
}

const Spending = () => {
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [unconfirmedStackExpanded, setUnconfirmedStackExpanded] = useState(false)
    const { screenSize } = useScreenContext()
    const collapsed = useAppSelector(selectSpendingSideBarCollapsed)
    const dispatch = useAppDispatch()

    return (
        <SpendingViewContextProvider
            value={{
                showFilterForm,
                setShowFilterForm,
                unconfirmedStackExpanded,
                setUnconfirmedStackExpanded
            }}>
            <div id="spending-window" className={`${screenSize ? screenSize : ''} ${collapsed ? 'collapsed' : ''}`}>
                <div>
                    <ExpandButton flipped={!collapsed} onClick={() => { dispatch(toggleSpendingSideBar()) }} />
                </div>
                <div>
                    <NeedsConfirmationWindow />
                    <HistoryWindow />
                </div>
                {collapsed && <NeedsConfirmationIndicator />}
            </div>
        </SpendingViewContextProvider>
    )
}
export default Spending
