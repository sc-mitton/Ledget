import { useSearchParams } from 'react-router-dom'

import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'


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
        <div>BudgetItemRows</div>
    )
}

export default BudgetItemRows
