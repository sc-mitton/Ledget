import { useState } from 'react'

import './styles/Window.css'
import NeedsConfirmationWindow from './needsConfirmation/Window'
import HistoryWindow from './history/Window'
import { FilterContextProvider } from './context'

const Spending = () => {
    const [showFilterForm, setShowFilterForm] = useState(false)

    return (
        <FilterContextProvider value={{ showFilterForm, setShowFilterForm }}>
            <div id="spending-window">
                <NeedsConfirmationWindow />
                <HistoryWindow />
            </div>
        </FilterContextProvider>
    )
}
export default Spending
