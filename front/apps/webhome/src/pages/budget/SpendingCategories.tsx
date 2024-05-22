import { useState, Fragment } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import './styles/SpendingCategories.scss'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import { selectCategoryMetaData, selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { Category } from '@features/categorySlice'
import {
    BlueTextButton,
    ColoredShimmer,
    CircleIconButton,
    Tooltip,
    BillCatEmojiLabel,
    DollarCents,
} from '@ledget/ui'
import { setCategoryModal } from '@features/modalSlice'
import { selectBudgetItemsSort } from '@features/uiSlice'
import { EditBudgetCategories } from '@modals/index'
import { Plus } from '@geist-ui/icons'

// - Combine the emoji symbol and it's progress towards the limit
// - Side by side for yearly and monthly categories, split into two windows like the mercury screenshot
// - Header for categories should be outside the window, 'view all' link positioned to the far right


const SkeletonCategories = ({ length, period }: { length: number, period: 'month' | 'year' }) => (
    <>
        {Array.from({ length: length }).map((_, i) => (
            <ColoredShimmer className='category-shimmer' shimmering={true} color={period === 'month' ? 'blue' : 'green'} />
        ))}
    </>
)

const CategoriesList = ({ period }: { period: Category['period'] }) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: categories, isLoading } = useGetCategoriesQuery({ month, year }, { skip: !month || !year })
    const sort = useAppSelector(selectBudgetItemsSort)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    return (
        <div className='categories'>
            <div>
                <h4>{`${period.charAt(0).toUpperCase()}${period.slice(1)}ly`}</h4>
                <Tooltip msg={`Add ${period}ly category`} >
                    <CircleIconButton
                        onClick={() => {
                            navigate(
                                `${location.pathname}/new-category/${location.search}`,
                                { state: { period: period } }
                            )
                        }}
                        aria-label='Add new category'
                    >
                        <Plus size='1em' />
                    </CircleIconButton>
                </Tooltip>
            </div>
            <hr />
            {isLoading
                ? <SkeletonCategories length={5} period={period} />
                : <div>
                    {categories?.filter(c => c.period === period)
                        .sort((a, b) => {
                            if (sort === 'amount-des') {
                                return b.amount_spent - a.amount_spent
                            } else if (sort === 'amount-asc') {
                                return a.amount_spent - b.amount_spent
                            } else if (sort === 'alpha-des') {
                                return a.name.localeCompare(b.name)
                            } else if (sort === 'alpha-asc') {
                                return b.name.localeCompare(a.name)
                            } else {
                                return 0
                            }
                        }).map((category, i) => (
                            <Fragment key={category.id}>
                                <div>
                                    <BillCatEmojiLabel
                                        size='medium'
                                        as='button'
                                        emoji={category.emoji}
                                        color={period === 'month' ? 'blue' : 'green'}
                                        key={category.id}
                                        onClick={() => { dispatch(setCategoryModal({ category: category })) }}
                                        // progress={Math.round(((category.amount_spent * 100) / category.limit_amount) * 100) / 100}
                                        progress={.5}
                                    />
                                    {`${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`}
                                </div>
                                <div>
                                    <DollarCents value={category.amount_spent} withCents={false} />
                                </div>
                                <div>/</div>
                                <div>
                                    {category.limit_amount !== null
                                        ? <DollarCents value={category.limit_amount} withCents={false} />
                                        : <span className='no-limit'> &#8212; </span>}
                                </div>
                            </Fragment>
                        ))}
                </div>}
        </div>
    )
}

const ColumnView = () => (
    <div id='spending-categories--columns'>
        <div className='window'>
            <CategoriesList period='month' />
        </div>
        <div className='window'>
            <CategoriesList period='year' />
        </div>
    </div>
)

const SpendingCategories = () => {
    const [modal, setModal] = useState(false)

    return (
        <>
            <div id='spending-categories'>
                <h3>Categories</h3>
                <BlueTextButton onClick={() => setModal(true)} aria-label='View all categories'>
                    View All
                </BlueTextButton>
                <ColumnView />
            </div>
            {modal && <EditBudgetCategories onClose={() => setModal(false)} />}
        </>
    )
}

export default SpendingCategories
