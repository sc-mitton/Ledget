import React, {
    FC,
    memo,
    Fragment,
    useMemo,
    useState,
    useRef,
    useEffect,
    createContext,
    useContext
} from 'react'

import Big from 'big.js'
import { Tab } from '@headlessui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ResponsiveLine } from '@nivo/line'
import type { Datum } from '@nivo/line'
import { Menu } from '@headlessui/react'
import dayjs from 'dayjs'
import { Plus, Edit2, Trash2 } from '@geist-ui/icons'

import { TransactionItem, DeleteCategoryModal } from '@modals/index'
import { Logo } from '@components/pieces'
import { useAppSelector } from '@hooks/store'
import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useLazyGetTransactionsQuery, Transaction } from '@features/transactionsSlice'
import { EditCategory as EditCategoryModal } from '@modals/index'
import {
    useLazyGetCategoriesQuery,
    SelectCategoryBillMetaData,
    selectCategories,
    useGetCategorySpendingHistoryQuery,
} from '@features/categorySlice'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    BluePrimaryButton,
    ColoredShimmer,
    PillOptionButton,
    FadeInOutDiv,
    useLoaded,
    IconButton3,
    ResponsiveLineContainer,
    formatCurrency,
    useNivoResponsiveBaseProps,
    useNivoResponsiveLineTheme,
    ChartTip,
    DropDownDiv,
    LoadingRing,
    ShimmerDiv,
    ShadowScrollDiv,
    BakedListBox,
    BillCatLabel,
    BillCatEmojiLabel,
    TabNavList,
    DropdownItem,
    useBillCatTabTheme
} from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useScreenContext } from '@context/context'


const CategoriesColumn = ({ period }: { period: 'month' | 'year' }) => {
    const { start, end } = useGetStartEndQueryParams()
    const [fetchCategories, { data: categoriesData, isLoading }] = useLazyGetCategoriesQuery()
    const navigate = useNavigate()

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
        <div className='column'>
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
                {isLoading
                    ? <ColoredShimmer shimmering={true} color={period === 'month' ? 'blue' : 'green'} />
                    : categoriesData?.filter(c => c.period === period).map((category) => {
                        return (
                            <>
                                <div>
                                    <BillCatEmojiLabel
                                        emoji={category.emoji}
                                        color={period === 'month' ? 'blue' : 'green'}
                                        key={category.id}
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
        </div>
    )
}

const TabView = () => {

    return (
        <Tab.Group>
            <Tab.List>
                <Tab>Monthly Spending</Tab>
                <Tab>Yearly Spending</Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <CategoriesColumn period='month' />
                </Tab.Panel>
                <Tab.Panel>
                    <CategoriesColumn period='year' />
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
