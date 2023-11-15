import { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Big from 'big.js'

import './styles/BudgetSummary.scss'
import { DollarCents, AnimatedDollarCents, StaticProgressCircle } from '@ledget/ui'
import { ThumbUp, CheckMark2 } from '@ledget/media'
import { SelectCategoryBillMetaData, useLazyGetCategoriesQuery } from '@features/categorySlice'
import { selectBillMetaData, useLazyGetBillsQuery } from '@features/billSlice'
import { useGetStartEndFromSearchParams } from '@hooks/utilHooks'

const SummaryState = ({ showMonthStats = false, showYearStats = false }) => {
    const [searchParams] = useSearchParams()
    const { start, end } = useGetStartEndFromSearchParams()

    const [getCategories, { isLoading: loadingCategories }] = useLazyGetCategoriesQuery()
    const [getBills, { isLoading: loadingBills }] = useLazyGetBillsQuery()
    const {
        monthly_spent,
        yearly_spent,
        total_monthly_spent,
        total_yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useSelector(SelectCategoryBillMetaData)
    const {
        monthly_bills_paid,
        yearly_bills_paid,
        number_of_monthly_bills,
        number_of_yearly_bills,
        monthly_bills_amount_remaining,
        yearly_bills_amount_remaining,
        total_monthly_bills_amount,
        total_yearly_bills_amount
    } = useSelector(selectBillMetaData)

    useEffect(() => {
        if (start && end) {
            getCategories({ start, end })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [start, end])

    return (
        <>
            {/* Summary (they're transparent until use hovers over them) */}
            {Array.from(['month', 'year']).map((period, i) => {
                return (
                    <div
                        key={period}
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
                                <div>
                                    <DollarCents value={
                                        period === 'month'
                                            ? total_monthly_spent || 0
                                            : total_yearly_spent || 0
                                    } />
                                </div>
                                <div>spent</div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <DollarCents value={
                                        (loadingBills || loadingCategories) ? '0.00' : period === 'month'
                                            ? Big(limit_amount_monthly || 0)
                                                .minus(monthly_spent).toNumber() || 0
                                            : Big(limit_amount_yearly || 0)
                                                .minus(yearly_spent).toNumber() || 0
                                    } />
                                </div>
                                <div>spending left</div>
                            </div>
                            <StaticProgressCircle
                                value={
                                    (loadingBills || loadingCategories) ? 0 : period === 'month'
                                        ? Math.round((monthly_spent / limit_amount_monthly) * 100) / 100
                                        : Math.round((yearly_spent / limit_amount_yearly) * 100) / 100
                                }
                                size={'1.2em'}
                            />
                        </div>
                        <div>
                            <div>
                                <div><DollarCents value={
                                    period === 'month'
                                        ? monthly_bills_amount_remaining || 0
                                        : yearly_bills_amount_remaining || 0
                                } /></div>
                                <div> in bills left</div>
                            </div>
                            <StaticProgressCircle value={
                                period === 'year'
                                    ? Math.round(yearly_bills_amount_remaining! / (total_yearly_bills_amount!)) / 100 || 0
                                    : Math.round(monthly_bills_amount_remaining! / (total_monthly_bills_amount!)) / 100 || 0
                            } size={'1.2em'} />
                        </div>
                        <div>
                            <div>
                                <span>
                                    {period === 'month'
                                        ? `${monthly_bills_paid} of ${number_of_monthly_bills}`
                                        : `${yearly_bills_paid} of ${number_of_yearly_bills}`
                                    }
                                </span>
                                <div>bills paid</div>
                            </div>
                            <div style={{
                                opacity: period === 'month'
                                    ? (monthly_bills_paid === 0 ? .25 : 1)
                                    : (yearly_bills_paid === 0 ? .25 : 1)
                            }}
                            >
                                <CheckMark2 fill={'currentColor'} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const SummaryStatsTeaser = ({
    setShowMonthStats = (a: boolean) => { },
    setShowYearStats = (a: boolean) => { },
}) => {
    const [searchParams] = useSearchParams()
    const { start, end } = useGetStartEndFromSearchParams()

    const [getCategories, { isLoading: loadingCategories }] = useLazyGetCategoriesQuery()
    const [getBills, { isLoading: loadingBills }] = useLazyGetBillsQuery()
    const {
        monthly_spent,
        yearly_spent,
        total_monthly_spent,
        total_yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useSelector(SelectCategoryBillMetaData)

    useEffect(() => {
        if (start && end) {
            getCategories({ start, end })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [start, end])

    return (
        <>
            {/* Summary Teasers */}
            <div>
                <div><h4>Total</h4></div>
                <div>
                    <AnimatedDollarCents
                        value={loadingCategories || loadingBills
                            ? 0
                            : (total_yearly_spent + total_monthly_spent)}
                    />
                </div>
                <div>spent</div>
            </div>
            {Array.from(['month', 'year']).map((period, i) => {
                const amountLeft = (period === 'month')
                    ? Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber()
                    : Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber()
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
                            <AnimatedDollarCents value={Math.abs(amountLeft)} hasCents={false} />
                        </div>
                        <div>
                            <span>{amountLeft >= 0 ? 'left' : 'over'}</span>
                            <ThumbUp
                                className={`thumbs ${amountLeft >= 0 ? 'up' : 'down'}`}
                                fill={'currentColor'}
                            />
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const BudgetSummary = () => {
    const [showMonthStats, setShowMonthStats] = useState(false)
    const [showYearStats, setShowYearStats] = useState(false)

    return (
        <div className={`budget-summary--container ${showMonthStats || showYearStats ? 'expanded' : ''}`}>
            <SummaryStatsTeaser setShowMonthStats={setShowMonthStats} setShowYearStats={setShowYearStats} />
            <SummaryState showMonthStats={showMonthStats} showYearStats={showYearStats} />
        </div>
    )
}

export default BudgetSummary
