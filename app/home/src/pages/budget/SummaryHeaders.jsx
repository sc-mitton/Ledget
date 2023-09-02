import React from 'react'

import './styles/SummaryHeaders.css'

const MonthSummaryHeader = () => {
    return (
        <div className="summary-header--container">
            <h3>
                Monthly&nbsp;
                <span>budget</span>
            </h3>
        </div>
    )
}

const YearSummaryHeader = () => {
    return (
        <div className="summary-header--container">
            <h3>
                Yearly&nbsp;
                <span>budget</span>
            </h3>
        </div>
    )
}

export { MonthSummaryHeader, YearSummaryHeader }
