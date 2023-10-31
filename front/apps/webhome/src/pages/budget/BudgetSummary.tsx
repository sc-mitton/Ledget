import { useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import './styles/BudgetSummary.scss'
import { DollarCents, StaticProgressCircle } from '@ledget/ui'
import { ThumbUp, CheckMark2 } from '@ledget/media'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'

const SummaryState = ({ showMonthStats = false, showYearStats = false }) => {
    const [searchParams] = useSearchParams()
    const { data: categoriesData, isLoading: loadingCategories } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
    const { data: billsData, isLoading: loadingBills } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

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
                                            ? categoriesData?.monthly_spent || 0
                                            : categoriesData?.yearly_spent || 0
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
                                            ? Big(categoriesData?.limit_amount_monthly || 0)
                                                .minus(categoriesData!.monthly_spent).toNumber() || 0
                                            : Big(categoriesData?.limit_amount_yearly || 0)
                                                .minus(categoriesData!.yearly_spent).toNumber() || 0
                                    } />
                                </div>
                                <div>spending left</div>
                            </div>
                            <StaticProgressCircle
                                value={
                                    (loadingBills || loadingCategories) ? 0 : period === 'month'
                                        ? Math.round((categoriesData!.monthly_spent / categoriesData!.limit_amount_monthly) * 100) / 100
                                        : Math.round((categoriesData!.yearly_spent / categoriesData!.limit_amount_yearly) * 100) / 100
                                }
                                size={'1.2em'}
                            />
                        </div>
                        <div>
                            <div>
                                <div><DollarCents value={
                                    period === 'month'
                                        ? billsData?.monthly_bills_amount_remaining || 0
                                        : billsData?.yearly_bills_amount_remaining || 0
                                } /></div>
                                <div> in bills left</div>
                            </div>
                            <StaticProgressCircle value={
                                period === 'year'
                                    ? Math.round(billsData?.yearly_bills_amount_remaining! / billsData?.total_yearly_bills_amount! * 100) / 100 || 0
                                    : Math.round(billsData?.monthly_bills_amount_remaining! / billsData?.total_monthly_bills_amount! * 100) / 100 || 0
                            } size={'1.2em'} />
                        </div>
                        <div>
                            <div>
                                <span>
                                    {period === 'month'
                                        ? `${billsData?.monthly_bills_paid} of ${billsData?.number_of_monthly_bills}`
                                        : `${billsData?.yearly_bills_paid} of ${billsData?.number_of_yearly_bills}`
                                    }
                                </span>
                                <div>bills paid</div>
                            </div>
                            <div>
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
    const { data: categoriesData, isLoading: loadingCategories } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
    const { isLoading: loadingBills } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <>
            {/* Summary Teasers */}
            <div>
                <div><h4>Total</h4></div>
                <div>
                    <DollarCents
                        value={loadingCategories || loadingBills
                            ? 0
                            : (categoriesData!.yearly_spent + categoriesData!.monthly_spent)}
                    />
                </div>
                <div>spent</div>
            </div>
            {Array.from(['month', 'year']).map((period, i) => {
                const amountLeft = period === 'month'
                    ? (categoriesData?.limit_amount_monthly && categoriesData?.monthly_spent)
                        ? Big(categoriesData.limit_amount_monthly || 0).minus(categoriesData.monthly_spent).toNumber()
                        : 0
                    : (categoriesData?.limit_amount_yearly && categoriesData?.yearly_spent)
                        ? Big(categoriesData.limit_amount_yearly || 0).minus(categoriesData.yearly_spent).toNumber()
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
        </>
    )
}

const BudgetSummary = () => {
    const [showMonthStats, setShowMonthStats] = useState(false)
    const [showYearStats, setShowYearStats] = useState(false)

    return (
        <div id="budget-summary--container">
            <SummaryStatsTeaser setShowMonthStats={setShowMonthStats} setShowYearStats={setShowYearStats} />
            <SummaryState showMonthStats={showMonthStats} showYearStats={showYearStats} />
        </div>
    )
}

export default BudgetSummary
