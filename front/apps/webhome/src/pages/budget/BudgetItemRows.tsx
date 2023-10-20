import { useGetCategoriesQuery } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'


const BudgetItemRows = ({ period }: { period: 'year' | 'month' }) => {
    const { data: categories, isSuccess: isCategoriesSuccess } = useGetCategoriesQuery()
    const { data: bills, isSuccess: isBillsSuccess } = useGetBillsQuery()

    return (
        <div>BudgetItemRows</div>
    )
}

export default BudgetItemRows
