import React, { FC, memo } from 'react'

import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Big from 'big.js'

import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { DollarCents, StaticProgressCircle, GrnPrimaryButton, BluePrimaryButton } from '@ledget/ui'
import { Plus } from '@ledget/media'


const NewCategoryButton: React.FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            {period === 'year'
                ?
                <BluePrimaryButton
                    className={`add-new-category ${period}`}
                    onClick={() => {
                        navigate(
                            `${location.pathname}/new-category/${location.search}`,
                            { state: { period: period } }
                        )
                    }}
                >
                    <Plus stroke={'currentColor'} />
                </BluePrimaryButton>
                :
                <GrnPrimaryButton
                    className={`add-new-category ${period}`}
                    onClick={() => {
                        navigate(
                            `${location.pathname}/new-category/${location.search}`,
                            { state: { period: period } }
                        )
                    }}
                >
                    <Plus stroke={'currentColor'} />
                </GrnPrimaryButton>
            }
        </>
    )
}

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
            {category.limit_amount ?
                <>
                    <div>
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                    <div>/</div>
                    <div>
                        <DollarCents
                            value={category.limit_amount ? Big(category.limit_amount).div(100).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                    <div>
                        <StaticProgressCircle value={
                            Math.round(Big(category.amount_spent || 0).div(category.limit_amount).times(100).toNumber()) / 100 || 0
                        } />
                    </div>
                </>
                :
                <>
                    <div className="spanned">
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'}
                            hasCents={false}
                        />
                    </div>
                </>
            }
        </div>
    )
}

const Rows = memo(({ categories, period }: { categories: Category[], period: 'month' | 'year' }) => {

    const totalSpent = categories.reduce((acc: number, category) =>
        Big(category.amount_spent || 0).times(100).add(acc).toNumber(), 0)

    const totalLimit = categories.reduce((acc: number, category) =>
        category.limit_amount + acc, 0)

    return (
        <div className="rows">
            <div className="row header">
                <div>
                    <h4>{`${period.toUpperCase()}LY`} SPENDING</h4>
                </div>
                <div>
                    <DollarCents value={totalLimit ? totalSpent : '0.00'} />
                </div>
                <div>/</div>
                <div>
                    <DollarCents value={totalLimit ? totalLimit : '0.00'} hasCents={false} />
                </div>
                <div>
                    <StaticProgressCircle value={
                        Math.round(totalSpent / totalLimit * 100) / 100
                    } />
                </div>
            </div>
            {categories.length > 0
                ?
                <>
                    {categories.map(category => (
                        <Row category={category} />
                    ))}
                </>
                :
                <NewCategoryButton period={period} />
            }
        </div>
    )
})

const SpendingCategories = () => {
    const [searchParams] = useSearchParams()
    const {
        data: categoriesData,
        isSuccess: categoriesSuccess,
        isLoading: categoriesIsLoading
    } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <div className="inner-window" id="spending-categories-window">
            {categoriesSuccess && (
                <>
                    <Column id="month-category-rows">
                        <Rows
                            categories={categoriesData?.filter(category => category.period === 'month') || []}
                            period="month"
                        />
                    </Column>
                    <Column id="year-category-rows">
                        <Rows
                            categories={categoriesData?.filter(category => category.period === 'year') || []}
                            period="year"
                        />
                    </Column>
                </>
            )}
        </div>
    )
}

export default SpendingCategories
