import React, { FC, memo, Fragment, useMemo, useState, useRef, useEffect } from 'react'

import Big from 'big.js'
import { Tab } from '@headlessui/react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ResponsiveLine } from '@nivo/line'
import type { Datum } from '@nivo/line'
import { Listbox } from '@headlessui/react'

import { Logo } from '@components/pieces'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import './styles/SpendingCategories.scss'
import type { Category } from '@features/categorySlice'
import { useLazyGetTransactionsQuery } from '@features/transactionsSlice'
import {
    useLazyGetCategoriesQuery,
    SelectCategoryBillMetaData,
    selectCategories,
    sortCategoriesAlpha,
    sortCategoriesAmountAsc,
    sortCategoriesAmountDesc,
    sortCategoriesDefault,
    useGetCategorySpendingHistoryQuery
} from '@features/categorySlice'
import {
    DollarCents,
    AnimatedDollarCents,
    StaticProgressCircle,
    GrnPrimaryButton,
    BluePrimaryButton,
    ColoredShimmer,
    PillOptionButton,
    FadeInOutDiv,
    useLoaded,
    CloseButton,
    ResponsiveLineContainer,
    formatCurrency,
    nivoResponsiveLineBaseProps,
    nivoResponsiveLineTheme,
    ChartTip,
    DropAnimation,
    LoadingRing
} from '@ledget/ui'
import { Plus, BackArrow, ArrowIcon, Edit } from '@ledget/media'
import { useGetStartEndFromSearchParams } from '@hooks/utilHooks'


const NewCategoryButton: React.FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            {period === 'year'
                ?
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
                :
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
            }
        </>
    )
}

const Column: FC<React.HTMLProps<HTMLDivElement>> = ({ children }) => {
    return (
        <div className="column">
            <div>{children}</div>
        </div>
    )
}

const Row = ({ category }: { category: Category }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className={`row ${category.period}`}>
            <div
                className="row-label"
                role="button"
                tabIndex={0}
                onClick={() => {
                    searchParams.set('category', category.id)
                    setSearchParams(searchParams)
                }}
            >
                <div>
                    <span>{category.emoji}</span>
                    <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                </div>
            </div>
            {category.limit_amount ?
                <>
                    <div>
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).times(100).toNumber() : '0'}
                            hasCents={false}
                        />
                    </div>
                    <div>/</div>
                    <div>
                        <DollarCents
                            value={category.limit_amount ? Big(category.limit_amount).div(100).toFixed(2) : '0'}
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
                <div className="spanned">
                    <DollarCents
                        value={category.amount_spent ? Big(category.amount_spent).times(100).toNumber() : '0.00'}
                        hasCents={false}
                    />
                </div>
            }
        </div>
    )
}

const SkeletonRows = ({ numberOfRows }: { numberOfRows: number }) => (
    <>
        <div className="skeleton-column month">
            {Array.from(Array(numberOfRows).keys()).map(i => (
                <ColoredShimmer key={i} shimmering={true} color={'blue'} />
            ))}
        </div>
        <div className="skeleton-column year">
            {Array.from(Array(numberOfRows).keys()).map(i => (
                <ColoredShimmer key={i} shimmering={true} color={'green'} />
            ))}
        </div>
    </>
)

const Rows = memo(({ categories, period }: { categories: Category[], period: 'month' | 'year' }) => {
    return (
        <>
            {(categories.length > 0)
                ?
                <>
                    {categories.map(category => (
                        <Row key={category.id} category={category} />
                    ))}
                </>
                :
                <NewCategoryButton period={period} />
            }
        </>
    )
})

const RowHeader: FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
        oldest_yearly_category_created
    } = useAppSelector(SelectCategoryBillMetaData)

    const totalSpent = period === 'month' ? monthly_spent : yearly_spent
    const totalLimit = period === 'month' ? limit_amount_monthly : limit_amount_yearly
    const yearly_start = oldest_yearly_category_created
        ? new Date(new Date().getFullYear(), new Date(oldest_yearly_category_created).getMonth(), 1)
        : null
    const yearly_end = yearly_start
        ? new Date(yearly_start.getFullYear() + 1, yearly_start.getMonth(), 1)
        : null

    return (
        <div className={`row header ${yearly_end ? 'has-alternate-header' : ''}`}>
            <div className={`${period === 'year' ? 'yearly' : 'monthly'}`}>
                <h4>
                    {`${period.toUpperCase()}LY`} <br /> SPENDING
                </h4>
                {period === 'year' && yearly_start && yearly_end &&
                    <h4>
                        {yearly_start.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                        <br />
                        -
                        {yearly_end.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                    </h4>}
            </div>
            <div>
                <div>
                    <AnimatedDollarCents value={totalSpent ? totalSpent : 0} />
                </div>
            </div>
            <div>/</div>
            <div>
                <DollarCents value={totalLimit ? totalLimit : '0.00'} hasCents={false} />
            </div>
            <div>
                <StaticProgressCircle value={
                    totalLimit && totalSpent ? Math.round(totalSpent / totalLimit * 100) / 100 : 0
                } />
            </div>
        </div>
    )
}

const ColumnView = ({ categories }: { categories: Category[] }) => {

    return (
        <>
            <Column>
                <RowHeader period='month' />
                <Rows
                    categories={categories?.filter(category => category.period === 'month') || []}
                    period="month"
                />
            </Column>
            <Column>
                <RowHeader period='year' />
                <Rows
                    categories={categories?.filter(category => category.period === 'year') || []}
                    period="year"
                />
            </Column>
        </>
    )
}

const TabView = ({ categories }: { categories: Category[] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useAppSelector(SelectCategoryBillMetaData)

    return (
        <Tab.Group as={Column} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List style={{ display: 'contents' }} className="row header">
                <div>
                    <Tab as={'span'}>MONTHLY SPENDING</Tab>
                    <Tab as={'span'}>YEARLY SPENDING</Tab>
                </div>
                <div>
                    <div>
                        <DollarCents
                            value={
                                selectedIndex === 0
                                    ? monthly_spent || '0.00'
                                    : yearly_spent || '0.00'
                            }
                        />
                    </div>
                </div>
                <div>/</div>
                <div>
                    <DollarCents
                        value={
                            selectedIndex === 0
                                ? limit_amount_monthly ? limit_amount_monthly : '0.00'
                                : limit_amount_yearly ? limit_amount_yearly : '0.00'
                        }
                        hasCents={false}
                    />
                </div>
                <div>
                    <StaticProgressCircle
                        value={
                            selectedIndex === 0
                                ? (monthly_spent && limit_amount_monthly) ? Math.round(monthly_spent / limit_amount_monthly * 100) / 100 : 0
                                : (yearly_spent && limit_amount_yearly) ? Math.round(yearly_spent / limit_amount_yearly * 100) / 100 : 0
                        }
                    />
                </div>
            </Tab.List>
            <Tab.Panels as={Fragment}>
                <Tab.Panel as={Fragment}>
                    <Rows
                        categories={categories?.filter(category => category.period === 'month') || []}
                        period="month"
                    />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                    <Rows
                        categories={categories?.filter(category => category.period === 'year') || []}
                        period="year"
                    />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}

const Footer = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useAppDispatch()

    return (
        <div>
            <PillOptionButton
                isSelected={['amount-asc', 'amount-desc'].includes(searchParams.get('cat-sort') || '')}
                onClick={() => {
                    // desc -> asc -> default
                    if (!['amount-desc', 'amount-asc'].includes(searchParams.get('cat-sort') || '')) {
                        dispatch(sortCategoriesAmountDesc())
                        searchParams.set('cat-sort', 'amount-desc')
                        setSearchParams(searchParams)
                    } else if (searchParams.get('cat-sort') === 'amount-desc') {
                        dispatch(sortCategoriesAmountAsc())
                        searchParams.set('cat-sort', 'amount-asc')
                        setSearchParams(searchParams)
                    } else {
                        dispatch(sortCategoriesDefault())
                        searchParams.delete('cat-sort')
                        setSearchParams(searchParams)
                    }
                }}
            >
                <span>$</span>
                <BackArrow
                    stroke={'currentColor'}
                    rotate={searchParams.get('cat-sort') === 'amount-asc' ? '90' : '-90'}
                    size={'.75em'}
                    strokeWidth={'16'}
                />
            </PillOptionButton>
            <PillOptionButton
                isSelected={searchParams.get('cat-sort') === 'alpha'}
                onClick={() => {
                    if (searchParams.get('cat-sort') === 'alpha') {
                        dispatch(sortCategoriesDefault())
                        searchParams.delete('cat-sort')
                        setSearchParams(searchParams)
                        return
                    } else {
                        dispatch(sortCategoriesAlpha())
                        searchParams.set('cat-sort', 'alpha')
                        setSearchParams(searchParams)
                    }
                }}
            >
                a-z
            </PillOptionButton>
        </div>

    )
}

const AmountSpentChart = ({ data, disabled = false }: { data: Datum[], disabled?: boolean }) => {
    const xaxisPadding = 8

    const maxY = Math.max(...data.map(d => d.y as number))
    const minY = Math.min(...data.map(d => d.y as number))

    // The magnitude of the difference between the min and max values
    // e.g. maxY = 1120 and minY = 871, magnitude = 100
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(maxY - minY))))
    const yScaleMin = Math.round(Math.floor(minY / magnitude) * magnitude)

    const chartMargin = useMemo<{ top: number, right: number, bottom: number, left: number }>(() => {
        const margin = { top: 0, right: 16, bottom: 0, left: 0 }
        const largestYAxisLabel = formatCurrency(maxY).split('.')[0]

        const rootElement = document.documentElement;
        const computedStyle = getComputedStyle(rootElement);

        // Compute left margin
        const fontStyle = ({
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight
        })

        const tempSpan = document.createElement('span')
        tempSpan.style.fontFamily = fontStyle.fontFamily
        tempSpan.style.fontSize = fontStyle.fontSize
        tempSpan.style.fontWeight = fontStyle.fontWeight

        tempSpan.textContent = largestYAxisLabel
        document.body.appendChild(tempSpan)
        margin.left = tempSpan.offsetWidth + xaxisPadding
        document.body.removeChild(tempSpan)

        // Compute bottom margin
        const rootFontSize = computedStyle.fontSize;
        margin.bottom = rootFontSize ? parseFloat(rootFontSize) * 2 : 16
        margin.top = rootFontSize ? parseFloat(rootFontSize) : 16
        return margin
    }, [data])

    return (
        <ResponsiveLine
            data={[{ id: 'amount-spent', data }]}
            margin={chartMargin}
            axisBottom={{
                format: (value: number) =>
                    new Date(value).toLocaleString('default', { month: 'short' })
            }}
            axisLeft={{
                tickValues: 4,
                tickPadding: xaxisPadding,
                format: (value: number) => formatCurrency(value).split('.')[0]
            }}
            areaBaselineValue={minY}
            tooltip={({ point }) => (
                <ChartTip>
                    <span>{new Date(point.data.x).toLocaleString('default', { month: 'short' })}</span>
                    &nbsp;&nbsp;
                    <DollarCents value={formatCurrency(point.data.y.toString())} />
                </ChartTip>
            )}
            yScale={{ type: 'linear', min: yScaleMin, max: data.length > 0 ? 'auto' : maxY / 100 }}
            gridYValues={4}
            crosshairType="bottom"
            theme={nivoResponsiveLineTheme}
            {...nivoResponsiveLineBaseProps({ disabled: disabled })}
        />
    )
}

const today = new Date()
const fakeChartData = [
    {
        month: new Date(today.getFullYear(), today.getMonth() - 4).getMonth(),
        year: new Date(today.getFullYear(), today.getMonth() - 4).getFullYear(),
        amount_spent: 2000
    },
    {
        month: new Date(today.getFullYear(), today.getMonth() - 3).getMonth(),
        year: new Date(today.getFullYear(), today.getMonth() - 3).getFullYear(),
        amount_spent: 2400
    },
    {
        month: new Date(today.getFullYear(), today.getMonth() - 2).getMonth(),
        year: new Date(today.getFullYear(), today.getMonth() - 2).getFullYear(),
        amount_spent: 2200
    },
    {
        month: new Date(today.getFullYear(), today.getMonth() - 1).getMonth(),
        year: new Date(today.getFullYear(), today.getMonth() - 1).getFullYear(),
        amount_spent: 2600
    },
]

// Information to include:

// amount spent, limit amount, progress circle
//  alerts on or off, edit button

const CategoryDetail = ({ category }: { category: Category }) => {
    const { start, end } = useGetStartEndFromSearchParams()
    const {
        data: spendingSummaryData,
        isSuccess: spendingSummaryDataIsFetched
    } = useGetCategorySpendingHistoryQuery({
        categoryId: category.id,
    })
    const [getTransaction, {
        data: transactionsData,
        isSuccess: transactionsDataIsFetched
    }] = useLazyGetTransactionsQuery()

    const [chartData, setChartData] = useState<Datum[]>([])

    const windowOptions = ['4 months', '1 year', '2 year', 'max'] as const
    const [disabledOptions, setDisabledOptions] = useState<(typeof windowOptions[number])[]>()
    const [window, setWindow] = useState<typeof windowOptions[number]>()
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Fetching Transactions
    useEffect(() => {
        getTransaction({
            confirmed: true,
            start: start,
            end: end,
            category: category.id,
        })
    }, [])

    useEffect(() => {
        const endOfWindow = new Date().setMonth(new Date().getMonth() - 1)
        if (!spendingSummaryData)
            return

        let windowEnd = new Date().setMonth(new Date().getMonth() - 4) // 4 months default end
        switch (window) {
            case '1 year':
                windowEnd = new Date().setMonth(new Date().getMonth() - 12)
                break;
            case '2 year':
                windowEnd = new Date().setMonth(new Date().getMonth() - 24)
                break;
            case 'max':
                windowEnd = 0
                break;
        }

        if (spendingSummaryData.length > 0) {
            setChartData(spendingSummaryData.filter(d =>
                new Date(d.year, d.month) > new Date(windowEnd)
            ).map(d => ({
                x: new Date(d.year, d.month).getTime(),
                y: d.amount_spent
            })))
        } else {
            setChartData(fakeChartData.map(d => ({
                x: new Date(d.year, d.month).getTime(),
                y: d.amount_spent
            })))
        }

    }, [window, spendingSummaryDataIsFetched])

    useEffect(() => {
        if (!spendingSummaryData)
            return

        if (spendingSummaryData.length < 4) {
            setDisabledOptions([...windowOptions])
        } else if (spendingSummaryData.length < 12) {
            setDisabledOptions(['1 year', '2 year'])
        } else if (spendingSummaryData.length < 24) {
            setDisabledOptions(['2 year'])
        }

    }, [spendingSummaryDataIsFetched])

    const WindowSelection = () => (
        <Listbox value={window} onChange={setWindow} as='div' className='chart-window-selectors'>
            {({ open }) => (
                <>
                    <Listbox.Button as={PillOptionButton} ref={buttonRef}>
                        {window}
                        <ArrowIcon
                            stroke={'currentColor'}
                            size={'.85em'}
                            strokeWidth={'18'}
                        />
                    </Listbox.Button>
                    <div className="chart-window-select--container">
                        <DropAnimation
                            placement='middle'
                            visible={open}
                            className="dropdown"
                            style={{ minWidth: `${buttonRef?.current?.offsetWidth}px` }}
                        >
                            <Listbox.Options className="chart-window-selector-options" static>
                                {windowOptions.filter(option => !disabledOptions?.includes(option))
                                    .map(option => (
                                        <Listbox.Option key={option} value={option}>
                                            {({ active, selected }) => (
                                                <div className={`dropdown-item
                                ${active && "active"}
                                ${selected && "selected"}`}
                                                >
                                                    {option}
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                            </Listbox.Options>
                        </DropAnimation>
                    </div>
                </>
            )}
        </Listbox>
    )

    return (
        <>
            <h2>{`${category.emoji} ${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`}</h2>
            <div className="grid">
                <div>
                    <ResponsiveLineContainer>
                        {window && <WindowSelection />}
                        {spendingSummaryData?.length === 0 &&
                            <span id="not-enough-data-message">
                                Not enough data to display yet
                            </span>
                        }
                        {spendingSummaryData
                            ?
                            <AmountSpentChart
                                data={chartData}
                                disabled={spendingSummaryData.length === 0}
                            />
                            : <LoadingRing visible={true} />
                        }
                    </ResponsiveLineContainer>
                </div>
                <div>
                    <div className="transactions-for-category">
                        <div>
                            <div>TOTAL</div>
                            <div />
                            <div>
                                <div>
                                    <AnimatedDollarCents
                                        value={category.amount_spent
                                            ? Big(category.amount_spent).times(100).toNumber()
                                            : 0}
                                    />
                                </div>
                                <div>/</div>
                                <div>
                                    <DollarCents
                                        value={category.limit_amount
                                            ? Big(category.limit_amount).div(100).toFixed(2)
                                            : 0}
                                        hasCents={false}
                                    />
                                </div>
                            </div>
                        </div>
                        {transactionsData?.results?.map(transaction => (
                            <div key={transaction.transaction_id}>
                                <div>
                                    <Logo accountId={transaction.account} />
                                    {transaction.name.slice(0, 15)}{transaction.name.length > 15 ? '...' : ''}
                                </div>
                                <div>
                                    {new Date(transaction.date).toLocaleDateString(
                                        'en-US', { month: 'numeric', day: 'numeric' })}
                                </div>
                                <div><div><DollarCents value={transaction.amount} /></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const SpendingCategories = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [fetchCategories, { isLoading }] = useLazyGetCategoriesQuery()
    const [isTabView, setIsTabView] = useState(false)
    const [skeletonRowCount, setSkeletonRowCount] = useState(5)
    const ref = useRef<HTMLDivElement>(null)
    const { start, end } = useGetStartEndFromSearchParams()
    const loaded = useLoaded(1000)
    const categories = useAppSelector(selectCategories)

    useEffect(() => {
        fetchCategories({ start: start, end: end }, true)
    }, [searchParams.get('month'), searchParams.get('year')])

    useEffect(() => {
        const handleResize = () => {
            setIsTabView(window.innerWidth < 600)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (ref.current) {
            const computedFontSize = ref.current ? window.getComputedStyle(ref.current!).fontSize : '0';
            const fontSizeInPixels = parseFloat(computedFontSize)
            const handleResize = () => {
                const columnHeight = ref.current?.clientHeight
                const rowHeight = fontSizeInPixels * 3.5
                setSkeletonRowCount(Math.floor(columnHeight! / rowHeight))
            }
            handleResize()
            window.addEventListener('resize', handleResize)
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [ref.current])

    return (
        <div id="spending-categories-window" className="window" ref={ref}>
            <AnimatePresence mode='wait'>
                {!searchParams.get('category')
                    ?
                    <FadeInOutDiv id="all-categorires-table" immediate={!loaded} key="all-categories">
                        {isLoading
                            ? <SkeletonRows numberOfRows={skeletonRowCount} />
                            : isTabView ? <TabView categories={categories} /> : <ColumnView categories={categories} />
                        }
                    </FadeInOutDiv>
                    :
                    <FadeInOutDiv key="category-detail" className="category-detail--container">
                        <CategoryDetail
                            category={categories.find(category =>
                                category.id === searchParams.get('category'))!}
                        />
                    </FadeInOutDiv>
                }
            </AnimatePresence>
            <AnimatePresence mode='wait'>
                {!searchParams.get('category')
                    ? <FadeInOutDiv id="category-filters--container" key="all-categories">
                        <Footer />
                    </FadeInOutDiv>
                    : <FadeInOutDiv key="category-detail">
                        <CloseButton
                            onClick={() => {
                                searchParams.delete('category')
                                setSearchParams(searchParams)
                            }}
                        />
                    </FadeInOutDiv>
                }
            </AnimatePresence>
        </div>
    )
}

export default SpendingCategories
