import React, { useState } from 'react'

import CashFlow from '../assets/svg/CashFlow'
import Graph from '../assets/svg/Graph'
import Ellipsis2 from '../assets/svg/Ellipsis2'

import MonthPicker from '../components/inputs/MonthPicker'

function Spending() {
    const [graphView, setGraphView] = useState(true)

    const Header = () => {
        return (
            <div className="window-header">
                <MonthPicker />
                <div className="window-header-buttons">
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className="icon"
                        aria-label="Toggle cash flow view"
                    >
                        <CashFlow />
                    </button>
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className="icon"
                        aria-label="Toggle graph view"
                        style={{
                            margin: "0 0.5em"
                        }}
                    >
                        <Graph />
                    </button>
                    <button
                        onClick={() => setGraphView(!graphView)}
                        className="icon"
                        aria-label="Extra options"
                    >
                        <Ellipsis2 />
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

