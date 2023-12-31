import { useState } from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from './needsConfirmation/Window'
import HistoryWindow from './history/Window'
import { SpendingViewContextProvider } from './context'
import { useScreenContext } from '@context/context'

const Spending = () => {
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [unconfirmedStackExpanded, setUnconfirmedStackExpanded] = useState(false)
    const { screenSize } = useScreenContext()

    return (
        <SpendingViewContextProvider
            value={{
                showFilterForm,
                setShowFilterForm,
                unconfirmedStackExpanded,
                setUnconfirmedStackExpanded
            }}>
            <div id="spending-window" style={{ paddingTop: screenSize === 'large' ? '3.375em' : '0em' }}>
                <NeedsConfirmationWindow />
                <HistoryWindow />
            </div>
        </SpendingViewContextProvider>
    )
}
export default Spending
