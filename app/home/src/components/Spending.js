import React, { useState } from 'react'

import CashFlow from '../assets/svg/CashFlow'
import Graph from '../assets/svg/Graph'

import MonthPicker from './inputs/MonthPicker'

function Spending() {
    const [graphView, setGraphView] = useState(true)

    const Header = () => {
        return (
            <div className="window-header">
                <MonthPicker />
                <div className="window-header-buttons">
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className={`window-header-button${!graphView ? '-selected' : ''}`}
                        aria-label="Toggle cash flow view"
                    >
                        <CashFlow fill={!graphView ? "var(--window)" : null} />
                    </button>
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className={`window-header-button${graphView ? '-selected' : ''}`}
                        aria-label="Toggle graph view"
                    >
                        <Graph fill={graphView ? "var(--window)" : null} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='window' id="spending-window">
            <Header />
        </div>
    )
}

export default Spending

