import React from 'react'

import './styles/Summary.css'
import StarsIcon from '@assets/icons/Recommendations'
import { MonthSummaryHeader } from './SummaryHeaders'

const MonthlySummary = () => {
    return (
        <div className="budget-summary--container">
            <div className="summary-stats--container">
                <div>
                    <div>
                        <span>$2432</span>
                        <span>spent in Aug</span>
                    </div>
                    <div>
                        <span>$300</span>
                        <span>left for Aug</span>
                    </div>
                    <div>
                        <StarsIcon
                            fill={'var(--m-text-gray)'}
                            height={'1.8em'}
                            width={'1.8em'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthlySummary
