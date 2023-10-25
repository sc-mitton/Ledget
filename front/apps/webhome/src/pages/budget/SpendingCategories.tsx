import React, { FC, useMemo, memo } from 'react'

import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'
import { DollarCents, StaticProgressCircle } from '@ledget/ui'


const Column: FC<React.HTMLProps<HTMLDivElement>> = ({ children }) => {
    return (
        <div className="column">
            {children}
        </div>
    )
}

const Row = ({ category }: { category: Category }) => {
    return (
        <div className={`row ${category.period}`}>
            <div className="row-label">
                <span>{category.emoji}</span>
                <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
            </div>
            <div className="row-value">
                <div>
                    <DollarCents value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'} />
                </div>
                {category.limit_amount &&
                    <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
                {category.limit_amount &&
                    <div>
                        <DollarCents
                            value={category.limit_amount ? Big(category.limit_amount).div(100).toFixed(2) : '0.00'}
                        />
                    </div>
                }
                <StaticProgressCircle value={
                    category.amount_spent
                        ? .5
                        : 0
                } />
            </div>
        </div>
    )
}

const Rows = memo(({ categories }: { categories: Category[] }) => {
    return (
        <div className="rows">
            {categories.map(category => (
                <Row category={category} />
            ))}
        </div>
    )
})

const SpendingCategories = () => {
    const [searchParams] = useSearchParams()
    const { data: categoriesData, isSuccess: categoriesSuccess } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    // const totalSpent = useMemo<number>(() => {
    //     return categoriesData ? categoriesData.filter(category => category.period === 'month').reduce((acc: number, category) =>
    //         Big(category.amount_spent).toNumber(), 0) : 0
    // }, [categoriesData])

    // const totalLimit = useMemo<number>(() => {
    //     return categoriesData ? categoriesData.filter(category => category.period === 'month').reduce((acc: number, category) =>
    //         Big(category.limit_amount).times(100).add(acc).toNumber(), 0) : 0
    // }, [categoriesData])

    return (
        <div className="inner-window" id="spending-categories-window">
            {categoriesSuccess && (
                <>
                    <Column id="month-category-rows">
                        <div className="row header">
                            <div className="row-label">
                                <h4>Monthly Spending</h4>
                            </div>
                            <div className="row-value">
                                <div><DollarCents value={'0.00'} /></div>
                                <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                                <div><DollarCents value={'0.00'} /></div>
                                {/* <StaticProgressCircle value={totalSpent && totalLimit ? Math.round(totalSpent / totalLimit) : 0} /> */}
                                <StaticProgressCircle value={.5} />
                            </div>
                        </div>
                        <Rows categories={categoriesData?.filter(category => category.period === 'month') || []} />
                    </Column>
                    <Column id="year-category-rows">
                        <Rows categories={categoriesData?.filter(category => category.period === 'year') || []} />
                    </Column>
                </>
            )}

        </div>
    )
}

export default SpendingCategories
