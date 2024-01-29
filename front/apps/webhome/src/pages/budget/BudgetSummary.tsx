import { useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import './styles/BudgetSummary.scss'
import { MonthPicker } from './MonthPicker'
import { SelectCategoryBillMetaData, useLazyGetCategoriesQuery } from '@features/categorySlice'
import { selectBillMetaData, useLazyGetBillsQuery } from '@features/billSlice'
import { useAppSelector } from '@hooks/store'
import { AnimatedDollarCents } from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useColorScheme } from '@ledget/ui'
import { useScreenContext } from '@context/context'

const BudgetSummary = () => {
    const [searchParams] = useSearchParams()
    const { start, end } = useGetStartEndQueryParams()

    const [getCategories, { isLoading: loadingCategories }] = useLazyGetCategoriesQuery()
    const [getBills, { isLoading: loadingBills }] = useLazyGetBillsQuery()
    const {
        monthly_spent,
        yearly_spent,
        total_monthly_spent,
        total_yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useAppSelector(SelectCategoryBillMetaData)
    const {
        monthly_bills_paid,
        yearly_bills_paid,
        number_of_monthly_bills,
        number_of_yearly_bills,
    } = useAppSelector(selectBillMetaData)

    useEffect(() => {
        if (start && end) {
            getCategories({ start, end })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [start, end])

    const { isDark } = useColorScheme()
    const { screenSize } = useScreenContext()

    return (
        <>
            <div id="month-picker--container" className={`${['small', 'extra-small'].includes(screenSize) ? 'small-screen' : ''}`}>
                <MonthPicker darkMode={isDark} />
            </div>
            <div className="budget-summary--container">
                <div>
                    <h3>total spent</h3>
                    <div>
                        <AnimatedDollarCents
                            value={loadingCategories || loadingBills
                                ? 0
                                : (total_yearly_spent + total_monthly_spent)}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <AnimatedDollarCents
                            value={Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber()}
                            withCents={false}
                        />
                        <span>spending left</span>
                    </div>
                    <div>
                        <AnimatedDollarCents
                            value={Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber() || 0}
                            withCents={false}
                        />
                        <span>spending left</span>
                    </div>
                    <div>
                        <span>
                            {monthly_bills_paid + yearly_bills_paid}
                            /{number_of_monthly_bills + number_of_yearly_bills}
                        </span>
                        <span>bills paid</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BudgetSummary
