import { useState } from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from './needsConfirmation/Window'
import HistoryWindow from './history/Window'
import { SpendingViewContextProvider } from './context'

const Spending = () => {
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [unconfirmedStackExpanded, setUnconfirmedStackExpanded] = useState(false)

    return (
        <SpendingViewContextProvider
            value={{
                showFilterForm,
                setShowFilterForm,
                unconfirmedStackExpanded,
                setUnconfirmedStackExpanded
            }}>
            <div id="spending-window">
                <NeedsConfirmationWindow />
                <HistoryWindow />
            </div>
        </SpendingViewContextProvider>
    )
}
export default Spending
