import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'
import { AlertCircle } from '@geist-ui/icons'

import './styles/BudgetSummary.scss'
import { MonthPicker } from './MonthPicker'
import { SelectCategoryBillMetaData, useLazyGetCategoriesQuery } from '@features/categorySlice'
import { selectBillMetaData, useLazyGetBillsQuery } from '@features/billSlice'
import { useAppSelector } from '@hooks/store'
import { AnimatedDollarCents, useScreenContext } from '@ledget/ui'
import { selectBudgetMonthYear } from '@features/uiSlice'
import { useColorScheme } from '@ledget/ui'

const BudgetSummary = () => {
    const [searchParams] = useSearchParams()
    const { month, year } = useAppSelector(selectBudgetMonthYear)

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
        if (month && year) {
            getCategories({ month, year })
            getBills({
                month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
                year: searchParams.get('year') || `${new Date().getFullYear()}`,
            })
        }
    }, [month, year])

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
                                    value={loadingCategories || loadingBills
                                        ? 0
                                        : (total_yearly_spent + total_monthly_spent)}
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
                                <span>{Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber() > 0 ? 'monthly spending left' : 'over monthly limit'}</span>
                                {Big(limit_amount_monthly || 0).minus(monthly_spent).toNumber() <= 0 && (
                                    <AlertCircle size={'1.125em'} />)}
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
                                <span>{Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber() > 0 ? 'yearly spending left' : 'over yearly limit'}</span>
                                {Big(limit_amount_yearly || 0).minus(yearly_spent).toNumber() <= 0 && (
                                    <AlertCircle size={'1.125em'} />)}
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
                            <a href={`#slide-${i + 1}`} key={i} className={carouselIndex === i ? 'active' : ''} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BudgetSummary
