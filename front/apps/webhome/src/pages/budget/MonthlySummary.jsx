import React from 'react'

import './styles/Summary.css'
import { Recommendations as StarsIcon } from '@ledget/shared-assets'


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
                            fill={'var(--green-dark4)'}
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
