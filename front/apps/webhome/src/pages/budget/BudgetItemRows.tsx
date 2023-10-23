import { useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'
import { DollarCents, StaticProgressCircle } from '@ledget/ui'


const BudgetItemRows = ({ period }: { period: 'year' | 'month' }) => {
    const [searchParams] = useSearchParams()

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const { data: categories, isSuccess: isCategoriesSuccess } = useGetCategoriesQuery({
        month: searchParams.get('month') || `${currentMonth}`,
        year: searchParams.get('year') || `${currentYear}`,
    })
    const { data: bills, isSuccess: isBillsSuccess } = useGetBillsQuery()

    return (
        <div className="budget-items-table--container">
            <div className="budget-items--table">
                {categories && categories.filter(category => category.period === period).map((category) => (
                    <div>
                        <div>
                            <span>
                                {category.emoji}&nbsp;&nbsp;
                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                            </span>
                        </div>
                        <DollarCents value={category.amount_spent ? Big(category.amount_spent).toFixed(2) : '0.00'} />
                        {category.limit_amount ? <div>/</div> : <div />}
                        {category.limit_amount
                            ? <DollarCents
                                hasCents={false}
                                value={Big(category.limit_amount).div(100).toFixed(2)} />
                            : <div />}
                        <div>
                            <StaticProgressCircle
                                value={category.limit_amount ? Math.round(category.amount_spent / category.limit_amount) : undefined}
                                noProgress={!category.limit_amount}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BudgetItemRows
