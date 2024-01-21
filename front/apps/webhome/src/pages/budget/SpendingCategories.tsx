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
    CloseButton,
    IconButton,
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
    TabNavList,
    DropdownItem,
} from '@ledget/ui'
import { Plus, ArrowIcon, Ellipsis, Edit, TrashIcon } from '@ledget/media'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useScreenContext } from '@context/context'

const categoryDetailContext = createContext<{
    detailedCategory?: Category,
    setDetailedCategory: React.Dispatch<React.SetStateAction<Category | undefined>>
} | undefined>(undefined)

const useCategoryDetailContext = () => {
    const context = useContext(categoryDetailContext)
    if (context === undefined) {
        throw new Error('useCategoryDetailContext must be used within a CategoryDetailProvider')
    }
    return context
}
const CategoryDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [detailedCategory, setDetailedCategory] = useState<Category>()

    return (
        <categoryDetailContext.Provider value={{ detailedCategory, setDetailedCategory }}>
            {children}
        </categoryDetailContext.Provider>
    )
}

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
            {children}
        </div>
    )
}

const Row = ({ category }: { category: Category }) => {
    const { setDetailedCategory } = useCategoryDetailContext()

    return (
        <div className={`row ${category.period}`}>
            <div>
                <BillCatLabel
                    slim={true}
                    name={category.name}
                    emoji={category.emoji}
                    color={category.period === 'year' ? 'green' : 'blue'}
                    onClick={() => {
                        setDetailedCategory(category)
                    }}
                />
            </div>
            {category.limit_amount ?
                <>
                    <div>
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).times(100).round(0, 0).toNumber() : '0'}
                            withCents={false}
                        />
                    </div>
                    <div>/</div>
                    <div>
                        <DollarCents
                            value={category.limit_amount ? Big(category.limit_amount).div(100).toFixed(2) : '0'}
                            withCents={false}
                        />
                    </div>
                    <div>
                        <StaticProgressCircle
                            value={Math.round(((category.amount_spent * 100) / category.limit_amount) * 100) / 100}
                            color={category.period === 'year' ? 'green' : 'blue'}
                        />
                    </div>
                </>
                :
                <>
                    <div className="spanned">
                        <DollarCents
                            value={category.amount_spent ? Big(category.amount_spent).times(100).toNumber() : '0.00'}
                            withCents={false}
                        />
                    </div>
                    <div /><div /><div />
                </>
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
    const navigate = useNavigate()
    const location = useLocation()

    const totalSpent = period === 'month' ? monthly_spent : yearly_spent
    const totalLimit = period === 'month' ? limit_amount_monthly : limit_amount_yearly
    const yearly_start = new Date(oldest_yearly_category_created).getMonth > new Date().getMonth
        ? dayjs(oldest_yearly_category_created).subtract(1, 'year').toDate()
        : dayjs(oldest_yearly_category_created).toDate()
    const yearly_end = yearly_start
        ? new Date(yearly_start.getFullYear() + 1, yearly_start.getMonth() - 1, 1)
        : null

    return (
        <div className={`row header ${yearly_end ? 'has-alternate-header' : ''}`}>
            <div className={`${period === 'year' ? 'yearly' : 'monthly'}`}>
                <div>
                    <h4>
                        {/* {`${period.charAt(0).toUpperCase()}${period.slice(1)}ly`} */}
                        {`${period.toUpperCase()}LY SPENDING`}
                    </h4>
                    {period === 'year' && yearly_start && yearly_end &&
                        <h4>
                            {yearly_start.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                            &nbsp;-&nbsp;
                            {yearly_end.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                        </h4>}
                </div>
                <IconButton onClick={() => {
                    navigate(
                        `${location.pathname}/new-category/${location.search}`,
                        { state: { period: period } }
                    )
                }}>
                    <Plus size={'.8em'} stroke={'currentColor'} />
                </IconButton>
            </div>
            <div><AnimatedDollarCents value={totalSpent ? totalSpent : 0} /></div>
            <div>/</div>
            <div><DollarCents value={totalLimit ? totalLimit : '0.00'} withCents={false} /></div>
            <div>
                <StaticProgressCircle
                    color={period === 'year' ? 'green' : 'blue'}
                    value={totalLimit && totalSpent ? Math.round(totalSpent / totalLimit * 100) / 100 : 0}
                />
            </div>
        </div>
    )
}

const ColumnView = ({ categories }: { categories?: Category[] }) => {

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

const TabView = ({ categories }: { categories?: Category[] }) => {
    const {
        monthly_spent,
        yearly_spent,
        limit_amount_monthly,
        limit_amount_yearly,
    } = useAppSelector(SelectCategoryBillMetaData)

    const TotalRow = ({ selectedIndex }: { selectedIndex: number }) => (
        <div className='row total header'>
            <div><h4>Total</h4></div>
            <div><div>
                <DollarCents value={selectedIndex === 0 ? monthly_spent || '0.00' : yearly_spent || '0.00'} />
            </div></div>
            <div>/</div>
            <div> <DollarCents
                value={
                    selectedIndex === 0
                        ? limit_amount_monthly ? limit_amount_monthly : '0.00'
                        : limit_amount_yearly ? limit_amount_yearly : '0.00'
                }
                withCents={false}
            />
            </div>
            <div>
                <StaticProgressCircle
                    value={
                        selectedIndex === 0
                            ? (monthly_spent && limit_amount_monthly) ? Math.round(monthly_spent / limit_amount_monthly) : 0
                            : (yearly_spent && limit_amount_yearly) ? Math.round(yearly_spent / limit_amount_yearly) : 0
                    }
                />
            </div>
        </div>
    )

    return (
        <Tab.Group as={Fragment}>
            {({ selectedIndex }) => (
                <>
                    <div>
                        <div className="tab-nav-cell">
                            <TabNavList
                                selectedIndex={selectedIndex}
                                labels={['Monthly', 'Yearly']}
                                className='spending-categories--tab-nav-list'
                            />
                        </div>
                    </div>
                    <Tab.Panels as={Fragment}>
                        <Tab.Panel as={Column}>
                            <>
                                <TotalRow selectedIndex={selectedIndex} />
                                <Rows
                                    categories={categories?.filter(category => category.period === 'month') || []}
                                    period="month"
                                />
                            </>
                        </Tab.Panel>
                        <Tab.Panel as={Column}>
                            <>
                                <TotalRow selectedIndex={selectedIndex} />
                                <Rows
                                    categories={categories?.filter(category => category.period === 'year') || []}
                                    period="year"
                                />
                            </>
                        </Tab.Panel>
                    </Tab.Panels>
                </>
            )}
        </Tab.Group>
    )
}

const AmountSpentChart = ({ data, disabled = false }: { data: Datum[], disabled?: boolean }) => {
    const xaxisPadding = 8
    const nivoResponsiveLineBaseProps = useNivoResponsiveBaseProps({ disabled })
    const nivoResponsiveLineTheme = useNivoResponsiveLineTheme()

    const maxY = Math.max(...data.map(d => d.y as number))
    const minY = Math.min(...data.map(d => d.y as number))

    // The magnitude of the difference between the min and max values
    // e.g. maxY = 1120 and minY = 871, magnitude = 100
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(maxY - minY))))
    const yScaleMin = Math.round(Math.floor(minY / magnitude) * magnitude)

    const chartMargin = useMemo<{ top: number, right: number, bottom: number, left: number }>(() => {
        const margin = { top: 0, right: 16, bottom: 0, left: 0 }
        const largestYAxisLabel = formatCurrency({ val: maxY, withCents: false })

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
                format: (value: number) => formatCurrency({ val: value, withCents: false })
            }}
            areaBaselineValue={minY}
            tooltip={({ point }) => (
                <ChartTip
                    position={point.index >= data.length / 2 ? 'left' : 'right'}
                >
                    <span>{new Date(point.data.x).toLocaleString('default', { month: 'short' })}</span>
                    &nbsp;&nbsp;
                    <DollarCents value={point.data.y as number} />
                </ChartTip>
            )
            }
            yScale={{ type: 'linear', min: yScaleMin, max: data.length > 0 ? 'auto' : maxY / 100 }}
            gridYValues={4}
            crosshairType="bottom"
            theme={nivoResponsiveLineTheme}
            {...nivoResponsiveLineBaseProps}
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

const CategoryDetail = ({ category }: { category: Category }) => {
    const { start, end } = useGetStartEndQueryParams()
    const {
        data: spendingSummaryData,
        isSuccess: spendingSummaryDataIsFetched
    } = useGetCategorySpendingHistoryQuery({
        categoryId: category.id,
    })
    const [getTransactions, {
        data: transactionsData,
        isSuccess: transactionsDataIsFetched
    }] = useLazyGetTransactionsQuery()
    const [TransactionItemItem, setTransactionItemItem] = useState<Transaction>()

    const [chartData, setChartData] = useState<Datum[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const windowOptions = ['4 months', '1 year', '2 year', 'max']
    const [disabledOptions, setDisabledOptions] = useState<(typeof windowOptions[number])[]>()
    const [window, setWindow] = useState<string>()
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
    const { screenSize } = useScreenContext()

    // Initial fetching Transactions
    useEffect(() => {
        if (start && end) {
            getTransactions({
                confirmed: true,
                start: category.period === 'month'
                    ? start
                    : new Date(start * 1000).setFullYear(new Date(start * 1000).getFullYear() - 1) / 1000,
                end,
                category: category.id,
            }, true)

        }
    }, [start, end])

    useEffect(() => {
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

        if (spendingSummaryData.length > 2) {
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
        <div className='chart-window-selectors'>
            <BakedListBox
                as={PillOptionButton}
                options={windowOptions}
                disabled={disabledOptions}
                defaultValue={windowOptions[0]}
                onChange={setWindow}
                placement='middle'
            />
        </div>
    )

    const Options = () => (
        <Menu>
            {({ open }) => (
                <div style={{ position: 'absolute', top: '.625em', right: '3em' }}>
                    <Menu.Button as={IconButton}>
                        <Ellipsis rotate={90} />
                    </Menu.Button>
                    <div style={{ position: 'absolute', right: '0' }}>
                        <DropDownDiv
                            placement='right'
                            visible={open}
                        >
                            <Menu.Items static>
                                <Menu.Item as={Fragment}>
                                    {({ active }) => (
                                        <DropdownItem
                                            as='button'
                                            active={active}
                                            onClick={() => { setShowEditCategoryModal(true) }}
                                        >
                                            <Edit size={'1em'} fill={'currentColor'} />
                                            Edit
                                        </DropdownItem>
                                    )}
                                </Menu.Item>
                                <Menu.Item as={Fragment}>
                                    {({ active }) => (
                                        <DropdownItem
                                            as='button'
                                            active={active}
                                            onClick={() => { setShowDeleteModal(true) }}
                                        >
                                            <TrashIcon size={'1em'} fill={'currentColor'} />
                                            Delete
                                        </DropdownItem>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </DropDownDiv>
                    </div>
                </div>
            )
            }
        </Menu >
    )

    const handleScroll = (e: any) => {
        const bottom = e.target.scrollTop === e.target.scrollTopMax
        // Update cursors to add new transactions node to the end
        if (bottom && transactionsData?.next) {
            getTransactions({
                confirmed: true,
                start: start,
                end: end,
                category: category.id,
                offset: transactionsData.next,
                limit: transactionsData.limit,
            })
        }
    }

    return (
        <>
            {TransactionItemItem &&
                <TransactionItem
                    item={TransactionItemItem}
                    onClose={() => setTransactionItemItem(undefined)}
                />}
            {showEditCategoryModal &&
                <EditCategoryModal
                    category={category}
                    maxWidth={'20rem'}
                    onClose={() => setShowEditCategoryModal(false)}
                />}
            {showDeleteModal &&
                <DeleteCategoryModal
                    category={category}
                    onClose={() => setShowDeleteModal(false)}
                />}
            <Options />
            <h2>{`${category.emoji}`}&nbsp;&nbsp;{`${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`}</h2>
            <div className={`category-detail ${screenSize === 'small' ? 'small' : ''}`}>
                <div>
                    <ResponsiveLineContainer>
                        {window && <WindowSelection />}
                        {(spendingSummaryData && spendingSummaryData?.length < 2) &&
                            <span id="not-enough-data-message">
                                Not enough data to display yet
                            </span>
                        }
                        {spendingSummaryData
                            ?
                            <AmountSpentChart
                                data={chartData}
                                disabled={spendingSummaryData.length < 2}
                            />
                            : <LoadingRing visible={true} />
                        }
                    </ResponsiveLineContainer>
                </div>
                <ShadowScrollDiv onScroll={handleScroll}>
                    {transactionsDataIsFetched
                        ?
                        <div
                            className={`transactions-for-category
                        ${transactionsData?.results?.length === 0 ? 'no-transactions' : ''}`}
                        >
                            <div>
                                <div>TOTAL</div>
                                <div />
                                <div>
                                    <div>
                                        <AnimatedDollarCents
                                            value={category.amount_spent
                                                ? Big(category.amount_spent).times(100).round(0, 2).toNumber()
                                                : 0}
                                        />
                                    </div>
                                    {category.limit_amount &&
                                        <><div>/</div>
                                            <div>
                                                <DollarCents
                                                    value={Big(category.limit_amount).div(100).toFixed(2)}
                                                    withCents={false}
                                                />
                                            </div></>}
                                </div>
                            </div>
                            {transactionsData?.results?.length === 0
                                ?
                                <div>
                                    <div className="no-transactions-message">No spending yet</div>
                                </div>
                                :
                                <>
                                    {transactionsData?.results?.map(transaction => (
                                        <div
                                            key={transaction.transaction_id}
                                            onClick={() => setTransactionItemItem(transaction)}
                                        >
                                            <div>
                                                <Logo accountId={transaction.account} />
                                                {transaction.name.slice(0, 15)}{transaction.name.length > 15 ? '...' : ''}
                                            </div>
                                            <div>
                                                {new Date(transaction.date).toLocaleDateString(
                                                    'en-US', { month: 'numeric', day: 'numeric' })}
                                            </div>
                                            <div>
                                                <div>
                                                    <DollarCents
                                                        value={
                                                            Big(transaction.amount)
                                                                .times(transaction.categories?.find(c => c.id === category.id)?.fraction || 1)
                                                                .times(100)
                                                                .round(0, 2)
                                                                .toNumber()
                                                        }
                                                    />
                                                </div>
                                                <ArrowIcon rotation={-90} size={'.75em'} />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            }
                        </div>
                        :
                        <div className="shimmer-div--container">
                            <ShimmerDiv shimmering={true} background={'var(--inner-window)'} />
                            <ShimmerDiv shimmering={true} background={'var(--inner-window)'} />
                            <ShimmerDiv shimmering={true} background={'var(--inner-window)'} />
                        </div>
                    }
                </ShadowScrollDiv>
            </div>
        </>
    )
}

const SpendingCategories = () => {
    const [fetchCategories, { isLoading, isUninitialized }] = useLazyGetCategoriesQuery()
    const [skeletonRowCount, setSkeletonRowCount] = useState(5)
    const ref = useRef<HTMLDivElement>(null)
    const { start, end } = useGetStartEndQueryParams()
    const loaded = useLoaded(1000)
    const categories = useAppSelector(selectCategories)
    const { detailedCategory, setDetailedCategory } = useCategoryDetailContext()
    const { screenSize } = useScreenContext()

    useEffect(() => {
        if (start && end)
            fetchCategories({ start: start, end: end }, true)
    }, [start && end])

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
        <div
            id="spending-categories-window"
            className={`window ${screenSize === 'small' ? 'tabbed' : ''}`}
            ref={ref}
        >
            <AnimatePresence mode='wait'>
                {!detailedCategory
                    ?
                    <FadeInOutDiv className={`all-categories-table ${screenSize === 'small' ? 'tab-view' : 'column-view'}`} immediate={!loaded} key="all-categories">
                        {(isLoading || isUninitialized)
                            ? <SkeletonRows numberOfRows={skeletonRowCount} />
                            : screenSize === 'small'
                                ? <TabView categories={categories} />
                                : <ColumnView categories={categories} />
                        }
                    </FadeInOutDiv>
                    :
                    <FadeInOutDiv
                        key="category-detail"
                        className={`category-detail--container ${screenSize === 'small' ? 'tabbed' : ''}`}
                    >
                        <CategoryDetail category={detailedCategory} />
                    </FadeInOutDiv>
                }
            </AnimatePresence>
            <AnimatePresence mode='wait'>
                {detailedCategory &&
                    <FadeInOutDiv key="category-detail">
                        <CloseButton onClick={() => { setDetailedCategory(undefined) }} />
                    </FadeInOutDiv>}
            </AnimatePresence>
        </div>
    )
}

export default function () {
    return (
        <CategoryDetailProvider>
            <SpendingCategories />
        </CategoryDetailProvider>
    )
}
