import React, { useState } from 'react'
import Big from 'big.js'
import { AlertCircle } from '@geist-ui/icons'

import './styles/CardsView.scss'
import { MonthPicker } from '../MonthPicker'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'
import { useAppSelector } from '@hooks/store'
import { AnimatedDollarCents, useScreenContext } from '@ledget/ui'
import { selectBudgetMonthYear, selectCategoryMetaData, selectBillMetaData } from '@features/budgetItemMetaDataSlice'
import { useColorScheme } from '@ledget/ui'

const BudgetSummary = () => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)

    const { isLoading: loadingCategories } = useGetCategoriesQuery({ month, year }, { skip: !month || !year })
    const { isLoading: loadingBills } = useGetBillsQuery({ month, year }, { skip: !month || !year })
    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useAppSelector(selectCategoryMetaData)
    const {
        monthly_bills_paid,
        yearly_bills_paid,
        number_of_monthly_bills,
        number_of_yearly_bills,
    } = useAppSelector(selectBillMetaData)

    const { isDark } = useColorScheme()
    const { screenSize } = useScreenContext()

    return (
        <>
            <div id='budget-summary-cards' className={`${screenSize} ${isDark ? 'dark' : 'light'}`}>
                <div id="budget-summary-cards--month-picker" className={`${screenSize}`}>
                    <MonthPicker darkMode={isDark} placement='left' size='medium' />
                </div>
                <div id='budget-summary-cards--cards'>
                    <div className='card'>
                        <div>
                            <AnimatedDollarCents
                                value={loadingCategories || loadingBills ? 0 : Big(yearly_spent).add(monthly_spent).toNumber()}
                            />
                        </div>
                        <span>total spending</span>
                    </div>
                    <div className='card'>
                        <div>
                            {monthly_bills_paid + yearly_bills_paid}
                            /{number_of_monthly_bills + number_of_yearly_bills}
                        </div>
                        <span>bills paid</span>
                    </div>
                    <div className='card'>
                        <div>
                            <AnimatedDollarCents
                                value={Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber()}
                                withCents={false}
                            />
                        </div>
                        <div>
                            {Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber() <= 0
                                ? <>
                                    <span>over monthly limit</span>
                                    <AlertCircle size={'1.125em'} />
                                </>
                                : <span>monthly spending left</span>}
                        </div>
                    </div>
                    <div className='card'>
                        <div>
                            <AnimatedDollarCents
                                value={Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber() || 0}
                                withCents={false}
                            />
                        </div>
                        <div>
                            {Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber() <= 0
                                ? <>
                                    <span>over yearly limit</span>
                                    <AlertCircle size={'1.125em'} />
                                </>
                                : <span>yearly spending left</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BudgetSummary
