import { useMemo, useEffect, useState, useRef, forwardRef } from 'react';

import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/store';
import { Plus, Calendar as CalendarIcon, CheckCircle, Circle, ChevronsDown } from '@geist-ui/icons'
import dayjs from 'dayjs';

import './styles/Bills.scss'
import { useAppDispatch } from '@hooks/store';
import { useGetBillsQuery } from '@features/billSlice';
import { selectBudgetItemsSort } from '@features/uiSlice';
import { selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { setBillModal } from '@features/modalSlice';
import {
    DollarCents,
    IconButton3,
    DropDownDiv,
    useAccessEsc,
    ShimmerText,
    BillCatLabel,
    useScreenContext,
    Tooltip
} from '@ledget/ui';


const Calendar = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: bills } = useGetBillsQuery({ month, year }, { skip: !month || !year })

    const selectedDate = dayjs().month(parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1)
        .year(parseInt(searchParams.get('year') || `${new Date().getFullYear()}`))

    const monthlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = bills?.length || 0
        for (let i = 0; i < numBills; i++) {
            if (bills?.[i].period !== 'month') {
                continue
            }
            const date = new Date(bills[i].date!)
            counts[date.getDate() - 1] += 1
        }
        return counts
    }, [bills])

    const yearlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = bills?.length || 0
        for (let i = 0; i < numBills; i++) {
            if (bills?.[i].period !== 'year') {
                continue
            }
            const date = new Date(bills![i].date!)
            counts[date.getDate() - 1] += 1
        }
        return counts
    }, [bills])

    return (
        <div className="calendar" ref={ref}>
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            {Array.from({ length: selectedDate.date(1).day() }).map((_, i) => <div key={i}></div>)}
            {Array.from({ length: selectedDate.daysInMonth() }).map((day, i) => {
                const djs = dayjs(selectedDate).date(i + 1)
                return (
                    // Cell
                    <div
                        key={i}
                        className={`
                            ${monthlyBillCountEachDay[i] > 0 || yearlyBillCountEachDay[i] > 0 ? 'hoverable' : ''}
                            ${searchParams.get('day') && searchParams.get('day') === `${djs.date()}` ? 'selected' : ''}
                        `}
                        tabIndex={monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1 ? 0 : -1}
                        role={monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1 ? 'button' : undefined}
                        aria-label={`${djs.format('MMMM YYYY')} bills`}
                        onClick={() => {
                            searchParams.get('day') && searchParams.get('day') === `${djs.date()}`
                                ? searchParams.delete('day')
                                : searchParams.set('day', `${djs.date()}`)
                            setSearchParams(searchParams)
                        }}
                    >
                        <span>{djs.date()}</span>
                        {(monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1) &&
                            <div role="tooltip">
                                {monthlyBillCountEachDay[i] > 0 &&
                                    <>
                                        <span className="has-bill-dot month" />
                                        <span>{monthlyBillCountEachDay[i]}</span>
                                    </>}
                                {yearlyBillCountEachDay[i] > 0 &&
                                    <>
                                        <span className="has-bill-dot year" />
                                        <span>{yearlyBillCountEachDay[i]}</span>
                                    </>}
                            </div>
                        }
                        {/* Below cell */}
                        {(monthlyBillCountEachDay[i] > 0 || yearlyBillCountEachDay[i] > 0) &&
                            <div className="has-bill-dot">
                                {monthlyBillCountEachDay[i] > 0 && <span className="month" />}
                                {yearlyBillCountEachDay[i] > 0 && <span className="year" />}
                            </div>}
                    </div>
                )
            })}
        </div >
    )
})

const Header = ({ collapsed, setCollapsed, showCalendarIcon = false }:
    { collapsed: boolean, showCalendarIcon: boolean, setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [searchParams] = useSearchParams()
    const selectedDate = new Date(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1,
    )
    const calendarRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (showCalendar) {
            calendarRef.current?.focus()
        }
    }, [showCalendar])

    useAccessEsc({
        refs: [dropdownRef, buttonRef],
        visible: showCalendar,
        setVisible: () => showCalendar && setShowCalendar(false),
    })

    return (
        <div style={{ marginLeft: showCalendar ? '.125em' : '' }} className='bills--header'>
            <div>
                <DropDownDiv
                    placement='left'
                    visible={showCalendar}
                    ref={dropdownRef}
                    style={{ borderRadius: 'var(--border-radius25)' }}
                >
                    <Calendar ref={calendarRef} />
                </DropDownDiv>
            </div>
            <div>
                <h4>
                    {selectedDate.toLocaleString('en-us', { month: 'short' }).toUpperCase()}&nbsp;
                    {selectedDate.getFullYear()} BILLS
                    {/* Bills */}
                </h4>
                {showCalendarIcon &&
                    <IconButton3
                        ref={buttonRef}
                        onClick={() => setShowCalendar(!showCalendar)}
                        tabIndex={0}
                        aria-label="Show calendar"
                        aria-haspopup="true"
                    >
                        <CalendarIcon className="icon" />
                    </IconButton3>}
                <Tooltip msg='Add bill'>
                    <IconButton3
                        onClick={() => {
                            navigate({
                                pathname: '/budget/new-bill',
                                search: location.search
                            })
                        }}
                        aria-label="Add bill"
                    >
                        <Plus className='icon' />
                    </IconButton3>
                </Tooltip>
            </div>
            <div>
                <Tooltip msg={collapsed ? 'Expand' : 'Collapse'}>
                    <IconButton3
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? 'Expand' : 'Collapse'}
                        className={`${collapsed ? 'rotated' : ''}`}
                    >
                        <ChevronsDown className='icon' />
                    </IconButton3>
                </Tooltip>
            </div>
        </div>
    )
}

const SkeletonBills = () => (
    <div
        className='bills-box'
        style={{ '--number-of-bills': 4 } as React.CSSProperties}
    >
        <>
            {Array.from(Array(8).keys()).map(i => (
                <ShimmerText key={i} shimmering={true} style={{ width: '100', height: '1.25em' }} />
            ))}
        </>
    </div>
)

const Bills = ({ collapsed }: { collapsed: boolean }) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: bills } = useGetBillsQuery({ month, year }, { skip: !month || !year })
    const sort = useAppSelector(selectBudgetItemsSort)

    const { screenSize } = useScreenContext()
    const dispatch = useAppDispatch()
    const [searchParams] = useSearchParams()

    return (
        <div
            className={`bills-box ${['extra-small'].includes(screenSize) ? 'small-screen' : ''}`}
            aria-expanded={!collapsed}
            style={{
                '--number-of-bills': bills?.length! / 2 || 0,
                ...(bills?.length || 0 <= 10 ? {} : {})
            } as React.CSSProperties}
        >
            {bills?.filter(bill => new Date(bill.date).getDate() === (parseInt(searchParams.get('day')!) || new Date(bill.date).getDate()))
                .sort((a, b) => {
                    if (sort === 'alpha-asc') {
                        return a.name.localeCompare(b.name)
                    } else if (sort === 'alpha-des') {
                        return b.name.localeCompare(a.name)
                    } else if (sort === 'amount-asc') {
                        return a.upper_amount - b.upper_amount
                    } else if (sort === 'amount-des') {
                        return b.upper_amount - a.upper_amount
                    } else {
                        return 0
                    }
                }).map((bill, i) => {
                    return (
                        <div
                            key={i} className={`${bill.period}ly-bill`}
                            role="button"
                            onClick={() => { dispatch(setBillModal({ bill: bill })) }}
                        >
                            <BillCatLabel
                                labelName={bill.name}
                                emoji={bill.emoji}
                                slim={true}
                                color={bill.period === 'month' ? 'blue' : 'green'}
                            >
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </BillCatLabel>
                            <div><DollarCents value={bill.upper_amount} /></div>
                            <div className={`${bill.is_paid || i < 4 ? 'is_paid' : 'not_paid'} ${bill.period}`}>
                                {bill.is_paid || i < 4
                                    ? <CheckCircle size={'1em'} />
                                    : <Circle size={'1em'} />}
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

const BillsWindow = () => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { isLoading } = useGetBillsQuery({ month, year }, { skip: !month || !year })
    const [collapsed, setCollapsed] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [showCalendar, setShowCalendar] = useState(true)
    const { screenSize } = useScreenContext()

    useEffect(() => {
        setShowCalendar(ref.current?.clientWidth! > 800)
        const observer = new ResizeObserver(() => {
            if (ref.current?.clientWidth! > 800) {
                setShowCalendar(true)
            } else {
                setShowCalendar(false)
            }
        })
        if (ref.current)
            observer.observe(ref.current)

        return () => { observer.disconnect() }
    }, [ref.current])

    return (
        <div className={`window bills-summary-window ${collapsed ? 'collapsed' : ''}`} ref={ref}>
            <div className={`calendar-bills--container ${collapsed ? 'collapsed' : ''} ${['small', 'extra-small'].includes(screenSize) ? 'small-screen' : ''}`}>
                <Header showCalendarIcon={!showCalendar} collapsed={collapsed} setCollapsed={setCollapsed} />
                <div>
                    {showCalendar && <Calendar />}
                    {isLoading ? <SkeletonBills /> : <Bills collapsed={collapsed} />}
                </div>
            </div>
        </div>
    )
}

export default BillsWindow
