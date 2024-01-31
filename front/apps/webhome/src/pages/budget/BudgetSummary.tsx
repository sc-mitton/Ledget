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
            <div id="month-picker--container" className={`${screenSize}`}>
                <MonthPicker darkMode={isDark} />
            </div>
            <div className={`budget-summary--container ${screenSize}`}>
                <div>
                    <div>
                        <AnimatedDollarCents
                            value={loadingCategories || loadingBills
                                ? 0
                                : (total_yearly_spent + total_monthly_spent)}
                        />
                    </div>
                    <h3>spent</h3>
                </div>
                <div>
                </div>
            </div>
        </>
    )
}

export default BudgetSummary
