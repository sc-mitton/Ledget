import { useState, Fragment } from 'react'

import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import './styles/BudgetSummary.scss'
import { DollarCents, StaticProgressCircle } from '@ledget/ui'
import { ThumbUp, CheckMark2 } from '@ledget/media'
import { useGetCategoriesQuery } from '@features/categorySlice'


const BudgetSummary = () => {
    const [searchParams] = useSearchParams()
    const [showMonthStats, setShowMonthStats] = useState(false)
    const [showYearStats, setShowYearStats] = useState(false)
    const { data } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <div id="budget-summary--container">
            <div>
                <div><h4>Total</h4></div>
                <div>
                    <DollarCents value={641364} />
                </div>
                <div>spent</div>
            </div>
            {Array.from(['month', 'year']).map((period, i) => {
                const amountLeft = period === 'month'
                    ? (data?.limit_amount_monthly && data?.monthly_spent)
                        ? Big(data.limit_amount_monthly || 0).minus(data.monthly_spent).toNumber()
                        : 0
                    : (data?.limit_amount_yearly && data?.yearly_spent)
                        ? Big(data.limit_amount_yearly || 0).minus(data.yearly_spent).toNumber()
                        : 0

                return (
                    <div
                        key={period}
                        tabIndex={0}
                        onFocus={() => period === 'month' ? setShowMonthStats(true) : setShowYearStats(true)}
                        onBlur={() => period === 'month' ? setShowMonthStats(false) : setShowYearStats(false)}
                        onMouseEnter={() => period === 'month' ? setShowMonthStats(true) : setShowYearStats(true)}
                        onMouseLeave={() => period === 'month' ? setShowMonthStats(false) : setShowYearStats(false)}
                    >
                        <div><h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4></div>
                        <div>
                            <DollarCents value={amountLeft} hasCents={false} />
                        </div>
                        <div>
                            <span>
                                {amountLeft >= 0 ? 'left' : 'overspent'}
                            </span>
                            <ThumbUp
                                fill={'currentColor'}
                                rotate={amountLeft >= 0 ? 0 : 180}
                            />
                        </div>
                    </div>
                )
            })}
            {Array.from(['total', 'month', 'year']).map((period, i) => {
                return (
                    <div
                        key={period}
                        className={`summary-stats
                            ${period}
                            ${period === 'month' && showMonthStats ? 'show' : 'show'}
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
                )
            })}
        </div>
    )
}

export default BudgetSummary
