import { Fragment, useEffect, useRef } from 'react'

import { Tab } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Plus } from '@geist-ui/icons'

import { useAppSelector } from '@hooks/store'
import './styles/SpendingCategories.scss'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { selectCategoryMetaData, selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { selectBudgetItemsSort } from '@features/uiSlice'
import { setCategoryModal } from '@features/modalSlice'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    ColoredShimmer,
    IconButton3,
    BillCatEmojiLabel,
    useScreenContext,
    Tooltip
} from '@ledget/ui'
import { useAppDispatch } from '@hooks/store'


const ColumnHeader = ({ period }: { period: 'month' | 'year' }) => {
    const navigate = useNavigate()

    return (
        <div className='column--header'>
            <h4>{`${period.toUpperCase()}LY SPENDING`}</h4>
            <Tooltip msg={`Add ${period}ly category`} >
                <IconButton3 onClick={() => {
                    navigate(
                        `${location.pathname}/new-category/${location.search}`,
                        { state: { period: period } }
                    )
                }}>
                    <Plus className='icon' />
                </IconButton3>
            </Tooltip>
        </div>
    )
}

const SkeletonCategories = ({ length, period }: { length: number, period: 'month' | 'year' }) => (
    <>
        {Array.from({ length: length }).map((_, i) => (
            <ColoredShimmer className='category-shimmer' shimmering={true} color={period === 'month' ? 'blue' : 'green'} />
        ))}
    </>
)

const Categories = ({ period, includeHeader = true }: { period: 'month' | 'year', includeHeader?: boolean }) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: categories, isLoading } = useGetCategoriesQuery({ month, year }, { skip: !month || !year })
    const dispatch = useAppDispatch()

    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
        oldest_yearly_category_created
    } = useAppSelector(selectCategoryMetaData)

    const totalSpent = period === 'month' ? monthly_spent : yearly_spent
    const totalLimit = period === 'month' ? limit_amount_monthly : limit_amount_yearly
    const yearly_start = new Date(oldest_yearly_category_created).getMonth > new Date().getMonth
        ? dayjs(oldest_yearly_category_created).subtract(1, 'year').toDate()
        : dayjs(oldest_yearly_category_created).toDate()
    const yearly_end = yearly_start
        ? new Date(yearly_start.getFullYear() + 1, yearly_start.getMonth() - 1, 1)
        : null
    const sort = useAppSelector(selectBudgetItemsSort)
    const ref = useRef<HTMLDivElement>(null)

    return (
        <>
            {isLoading
                ? <SkeletonCategories length={5} period={period} />
                :
                <>
                    {includeHeader && <ColumnHeader period={period} />}
                    <div className='categories' ref={ref}>
                        <div className={`${period}`}>
                            Total
                        </div>
                        <div>
                            <AnimatedDollarCents value={totalSpent ? totalSpent : 0} withCents={false} />
                        </div>
                        <div>spent of</div>
                        <div>
                            <DollarCents value={totalLimit ? totalLimit : 0} withCents={false} />
                        </div>
                        <div>
                            <StaticProgressCircle
                                color={period === 'year' ? 'green' : 'blue'}
                                value={totalLimit && totalSpent ? Math.round(totalSpent / totalLimit * 100) / 100 : 0}
                            />
                        </div>
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
                                            as='button'
                                            emoji={category.emoji}
                                            color={period === 'month' ? 'blue' : 'green'}
                                            key={category.id}
                                            onClick={() => { dispatch(setCategoryModal({ category: category })) }}
                                        />
                                        {`${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`}
                                    </div>
                                    <div>
                                        <DollarCents value={category.amount_spent} withCents={false} />
                                    </div>
                                    <div>spent of</div>
                                    <div>
                                        {category.limit_amount !== null
                                            ? <DollarCents value={category.limit_amount} withCents={false} />
                                            : <span className='no-limit'> &#8212; </span>}
                                    </div>
                                    <div>
                                        <StaticProgressCircle
                                            value={Math.round(((category.amount_spent * 100) / category.limit_amount) * 100) / 100}
                                            color={category.period === 'year' ? 'green' : 'blue'}
                                        />
                                    </div>
                                </Fragment>
                            ))}
                    </div>
                </>
            }
        </>
    )
}

const TabView = () => {
    const navigate = useNavigate()
    return (
        <Tab.Group as='div' className='column'>
            {({ selectedIndex }) => (
                <>
                    <Tab.List className='column--header'>
                        <Tab><h4>MONTHLY</h4></Tab>
                        <Tab><h4>YEARLY</h4></Tab>
                        <IconButton3
                            onClick={() => {
                                selectedIndex === 0
                                    ? navigate(
                                        `${location.pathname}/new-category/${location.search}`,
                                        { state: { period: 'month' } })
                                    : navigate(
                                        `${location.pathname}/new-category/${location.search}`,
                                        { state: { period: 'year' } })
                            }}
                        >
                            <Plus className='icon' />
                        </IconButton3>
                    </Tab.List>
                    <Tab.Panels as={Fragment}>
                        <Tab.Panel as={Fragment}>
                            <Categories period='month' includeHeader={false} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Categories period='year' includeHeader={false} />
                        </Tab.Panel>
                    </Tab.Panels>
                </>
            )}
        </Tab.Group>
    )
}

const SpendingCategories = () => {
    const { screenSize } = useScreenContext()

    return (
        <div className={`${['small', 'extra-small'].includes(screenSize) ? 'tabbed' : ''} window spending-categories`}>
            <div className="spending-categories--container">
                {['small', 'extra-small'].includes(screenSize)
                    ? <TabView />
                    : <>
                        <div className='column'>
                            <Categories period='month' />
                        </div>
                        <div className='column'>
                            <Categories period='year' />
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default SpendingCategories
