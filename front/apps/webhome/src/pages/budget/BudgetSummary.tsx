import { useState } from 'react'

import './styles/BudgetSummary.scss'
import { DollarCents, StaticProgressCircle } from '@ledget/ui'
import { ThumbUp, CheckMark2 } from '@ledget/media'


const BudgetSummary = () => {
    const [showMonthStats, setShowMonthStats] = useState(false)
    const [showYearStats, setShowYearStats] = useState(false)

    return (
        <div id="budget-summary--container">
            <div>
                <h4>Total</h4>
            </div>
            <div
                tabIndex={0}
                className={`${showMonthStats ? 'expand' : ''} month-header`}
                onFocus={() => setShowMonthStats(true)}
                onBlur={() => setShowMonthStats(false)}
                onMouseEnter={() => setShowMonthStats(true)}
                onMouseLeave={() => setShowMonthStats(false)}
            >
                <h4>Month</h4>
            </div>
            <div
                tabIndex={0}
                className={`${showYearStats ? 'expand' : ''} year-header`}
                onFocus={() => setShowYearStats(true)}
                onBlur={() => setShowYearStats(false)}
                onMouseEnter={() => setShowYearStats(true)}
                onMouseLeave={() => setShowYearStats(false)}
            >
                <h4>Year</h4>
            </div>
            <div>
                {/* Summary stats teaser */}
                <>
                    {Array.from(['total', 'month', 'year']).map((period, i) => {
                        const hasThumbs = period === 'year' || period === 'month'
                        return (
                            <>
                                <div className={`summary-stats-teaser ${period}`} >
                                    <div>
                                        <DollarCents value={641364} />
                                    </div>
                                    <div>
                                        <span>{period === 'total' ? 'spent' : 'left'}</span>
                                        {hasThumbs && <ThumbUp fill={'currentColor'} />}
                                    </div>
                                </div>
                                <div
                                    className={`summary-stats
                                        ${period}
                                        ${period === 'month' && showMonthStats ? 'show' : ''}
                                        ${period === 'year' && showYearStats ? 'show' : ''}`}
                                    aria-hidden={
                                        (period === 'month' && !showMonthStats) ||
                                        (period === 'year' && !showYearStats)
                                    }
                                    aria-label={`${period} stats`}
                                >
                                    <div>
                                        <div>
                                            <div><DollarCents value={641364} /></div>
                                            <div>spent</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div><DollarCents value={41364} /></div>
                                            <div>spending left</div>
                                        </div>
                                        <StaticProgressCircle value={.5} size={'1.2em'} />
                                    </div>
                                    <div>
                                        <div>
                                            <div><DollarCents value={41364} /></div>
                                            <div> in bills left</div>
                                        </div>
                                        <StaticProgressCircle value={.85} size={'1.2em'} />
                                    </div>
                                    <div>
                                        <div>
                                            <span>9 of 11</span>
                                            <div>bills paid</div>
                                        </div>
                                        <div>
                                            <CheckMark2 fill={'currentColor'} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </>
            </div>
        </div>
    )
}

export default BudgetSummary
