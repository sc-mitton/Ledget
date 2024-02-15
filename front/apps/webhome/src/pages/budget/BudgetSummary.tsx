import React, { useEffect, useState } from 'react'
import Big from 'big.js'
import { AlertCircle } from '@geist-ui/icons'

import './styles/BudgetSummary.scss'
import { MonthPicker } from './MonthPicker'
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
    const [carouselIndex, setCarouselIndex] = useState(0)

    const updateCarouselIndex = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const scrollLeft = target.scrollLeft
        const width = target.clientWidth
        const index = Math.round(scrollLeft / width)
        setCarouselIndex(index)
    }

    return (
        <>
            <div className={`budget-summary--container ${screenSize} ${isDark ? 'dark-mode' : ''}`}>
                <div id="month-picker--container" className={`${screenSize}`}>
                    <MonthPicker darkMode={isDark} />
                </div>
                <div className='slider'>
                    <div className='slides' onScroll={updateCarouselIndex}>
                        <div className='slide' id='slide-1'>
                            <div>
                                <AnimatedDollarCents
                                    value={loadingCategories || loadingBills ? 0 : Big(yearly_spent).add(monthly_spent).toNumber()}
                                // value={207452}
                                />
                            </div>
                            <span>total spending</span>
                        </div>
                        <div className='slide' id='slide-2'>
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
                        <div className='slide' id='slide-3'>
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
                        <div className='slide' id='slide-4'>
                            <div>
                                {monthly_bills_paid + yearly_bills_paid}
                                /{number_of_monthly_bills + number_of_yearly_bills}
                            </div>
                            <span>bills paid</span>
                        </div>
                    </div>
                    <div className='jump-links'>
                        {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                            <a href={`#slide-${i + 1}`} key={`carousel-${i}`} className={carouselIndex === i ? 'active' : ''} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BudgetSummary
