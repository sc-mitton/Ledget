import { Fragment, useEffect, useRef } from 'react'

import { Tab } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Plus } from '@geist-ui/icons'

import { useAppSelector } from '@hooks/store'
import './styles/SpendingCategories.scss'
import {
    useLazyGetCategoriesQuery,
    SelectCategoryBillMetaData,
    selectCategories
} from '@features/categorySlice'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    ColoredShimmer,
    IconButton3,
    BillCatEmojiLabel,
    useScreenContext
} from '@ledget/ui'
import { useAppDispatch } from '@hooks/store'
import { setCategoryModal } from '@features/uiSlice'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'

const ColumnHeader = ({ period }: { period: 'month' | 'year' }) => {
    const navigate = useNavigate()

    return (
        <div className='column--header'>
            <h4>{`${period.toUpperCase()}LY SPENDING`}</h4>
            <IconButton3 onClick={() => {
                navigate(
                    `${location.pathname}/new-category/${location.search}`,
                    { state: { period: period } }
                )
            }}>
                <Plus className='icon' />
            </IconButton3>
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

const CategoriesColumn = ({ period, includeHeader = true }: { period: 'month' | 'year', includeHeader?: boolean }) => {
    const { start, end } = useGetStartEndQueryParams()
    const [fetchCategories, { data: categoriesData, isLoading }] = useLazyGetCategoriesQuery()
    const columnRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const categories = useAppSelector(selectCategories)

    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
        oldest_yearly_category_created
    } = useAppSelector(SelectCategoryBillMetaData)

    const totalSpent = period === 'month' ? monthly_spent : yearly_spent
    const totalLimit = period === 'month' ? limit_amount_monthly : limit_amount_yearly
    const yearly_start = new Date(oldest_yearly_category_created).getMonth > new Date().getMonth
        ? dayjs(oldest_yearly_category_created).subtract(1, 'year').toDate()
        : dayjs(oldest_yearly_category_created).toDate()
    const yearly_end = yearly_start
        ? new Date(yearly_start.getFullYear() + 1, yearly_start.getMonth() - 1, 1)
        : null

    useEffect(() => {
        if (start && end)
            fetchCategories({ start: start, end: end }, true)
    }, [start && end])

    return (
        <>
            {isLoading
                ? <div className='column skeleton'>
                    <SkeletonCategories length={(columnRef.current?.offsetHeight || 200 / 30) || 5} period={period} />
                </div>
                : <div className='column' ref={columnRef}>
                    {includeHeader && <ColumnHeader period={period} />}
                    <div className='column--grid'>
                        <div className={`${period}`}>
                            Total
                        </div>
                        <div>
                            <AnimatedDollarCents value={totalSpent ? totalSpent : 0} withCents={false} />
                        </div>
                        <div>spent of</div>
                        <div>
                            <DollarCents value={totalLimit ? totalLimit : '0.00'} withCents={false} />
                        </div>
                        <div>
                            <StaticProgressCircle
                                color={period === 'year' ? 'green' : 'blue'}
                                value={totalLimit && totalSpent ? Math.round(totalSpent / totalLimit * 100) / 100 : 0}
                            />
                        </div>
                        {categories?.filter(c => c.period === period).map((category) => {
                            return (
                                <>
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
                                </>
                            )
                        })}
                    </div>
                </div>}
        </>
    )
}

const TabView = () => {
    return (
        <Tab.Group>
            <Tab.List>
                <Tab><h4>MONTHLY</h4></Tab>
                <Tab><h4>YEARLY</h4></Tab>
            </Tab.List>
            <Tab.Panels as={Fragment}>
                <Tab.Panel as={Fragment}>
                    <CategoriesColumn period='month' includeHeader={false} />
                </Tab.Panel>
                <Tab.Panel>
                    <CategoriesColumn period='year' includeHeader={false} />
                </Tab.Panel>
            </Tab.Panels>
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
                        <CategoriesColumn period='month' />
                        <CategoriesColumn period='year' />
                    </>}
            </div>
        </div>
    )
}

export default SpendingCategories
