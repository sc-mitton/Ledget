import React from 'react'

import './styles/View.css'
import MonthlySummary from './MonthlySummary'
import YearlySummary from './YearlySummary'
import { MonthSummaryHeader, YearSummaryHeader } from './SummaryHeaders'
import BudgetItemRows from './BudgetItemRows'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'

const ColumnarView = () => {
    const { data: categories } = useGetCategoriesQuery()
    const { data: bills } = useGetBillsQuery()

    return (
        <>
            <div className="columnar--view">
                <div>
                    <MonthSummaryHeader />
                    <MonthlySummary />
                </div>
                <div >
                    <YearSummaryHeader />
                    <YearlySummary />
                </div>
            </div>
            <div className="columnar--view budget--content">
                <div>
                    <BudgetItemRows period="month" categories={categories} bills={bills} />
                </div>
                <div >
                    <BudgetItemRows period="year" categories={categories} bills={bills} />
                </div>
            </div>
        </>
    )
}

export default ColumnarView
