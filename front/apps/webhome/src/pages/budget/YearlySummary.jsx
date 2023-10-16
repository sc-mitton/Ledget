import React from 'react'

import { Recommendations as StarsIcon } from '@ledget/media'
import { YearSummaryHeader } from './SummaryHeaders'

const YearlySummary = () => {
    return (
        <div className="budget-summary--container">
            <div className="summary-stats--container">
                <div>
                    <div>
                        <span>$1137</span>
                        <span>spent in Aug</span>
                    </div>
                    <div>
                        <span>$4072</span>
                        <span>left for 2023</span>
                    </div>
                    <div>
                        <StarsIcon
                            height={'1.8em'}
                            width={'1.8em'}
                            fill={'var(--green-dark4)'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YearlySummary
