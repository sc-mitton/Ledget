import { useMemo, useEffect, useState, useRef, forwardRef } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@hooks/store';

import './styles/Bills.scss'
import {
    useGetBillsQuery,
    selectBills,
    sortBillsByAlpha,
    sortBillsByDate,
} from '@features/billSlice';
import {
    DollarCents,
    PillOptionButton,
    IconScaleButton,
    ExpandButton,
    DropAnimation,
    useAccessEsc,
    ShimmerText
} from '@ledget/ui';
import { Calendar as CalendarIcon, CheckMark2 } from '@ledget/media'


function getDaysInMonth(year: number, month: number): Date[] {
    // JavaScript months are 0-based, so we subtract 1 from the provided month.
    const date = new Date(year, month - 1, 1);
    const days = [];

    while (date.getMonth() === month - 1) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return days;
}

const Calendar = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
    const bills = useAppSelector(selectBills)

    const selectedDate = new Date(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1,
    )

    const days = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1)

    const monthlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = bills?.length || 0
        for (let i = 0; i < numBills; i++) {
            if (bills[i].period !== 'month') {
                continue
            }
            const date = new Date(bills[i].date!)
            counts[date.getDate() - 1] += 1
        }
        return counts
    }, [bills])

    const yearlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = bills.length || 0
        for (let i = 0; i < numBills; i++) {
            if (bills[i].period !== 'year') {
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
            {Array.from(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).map((day, i) => {
                if (day !== days[0].toLocaleString('en-us', { weekday: 'long' })) {
                    return <div key={i}></div>
                } else {
                    return
                }
            })}
            {days.map((day, i) => {
                return (
                    // Cell
                    <div
                        key={i}
                        className={`
                            ${monthlyBillCountEachDay[i] > 0 || yearlyBillCountEachDay[i] > 0 ? 'hoverable' : ''}
                            ${searchParams.get('day') && searchParams.get('day') === `${day.getDate()}` ? 'selected' : ''}
                        `}
                        tabIndex={monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1 ? 0 : -1}
                        role={monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1 ? 'button' : undefined}
                        aria-label={`${day.toLocaleString('en-us', { month: 'long' })} ${day.getDate()} bills`}
                        onClick={() => {
                            searchParams.get('day') && searchParams.get('day') === `${day.getDate()}`
                                ? searchParams.delete('day')
                                : searchParams.set('day', `${day.getDate()}`)
                            setSearchParams(searchParams)
                        }}
                    >
                        {day.getDate()}
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

const Header = ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (a: boolean) => void }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedDate = new Date(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1,
    )
    const calendarRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [showCalendar, setShowCalendar] = useState(false)

    useEffect(() => {
        if (showCalendar) {
            calendarRef.current?.focus()
        }
    }, [showCalendar])

    useAccessEsc({
        refs: [dropdownRef, buttonRef],
        visible: showCalendar,
        setVisible: () => setShowCalendar(false),
    })

    return (
        <div>
            <div>
                <h3>
                    {selectedDate.toLocaleString('en-us', { month: 'short' }).toUpperCase()}&nbsp;
                    {selectedDate.getFullYear()} BILLS
                </h3>
            </div>
            <div>
                <IconScaleButton
                    ref={buttonRef}
                    onFocus={() => setShowCalendar(true)}
                    onBlur={() => setShowCalendar(false)}
                    onClick={() => setShowCalendar(!showCalendar)}
                    tabIndex={0}
                    aria-label="Show calendar"
                    aria-haspopup="true"
                >
                    <CalendarIcon size={'1.4em'} />
                </IconScaleButton>
                <DropAnimation
                    placement='middle'
                    visible={showCalendar}
                    className="dropdown" ref={dropdownRef}
                >
                    <Calendar ref={calendarRef} />
                </DropAnimation>
            </div>
            <div>
                <PillOptionButton
                    aria-label="Sort bills by amount"
                    isSelected={searchParams.get('bill-sort') === 'a-z'}
                    onClick={() => {
                        searchParams.set('bill-sort', 'a-z')
                        setSearchParams(searchParams)
                    }}
                >
                    a-z
                </PillOptionButton>
                <PillOptionButton
                    aria-label="Sort bills by date"
                    isSelected={searchParams.get('bill-sort') === 'date'}
                    onClick={() => {
                        searchParams.set('bill-sort', 'date')
                        setSearchParams(searchParams)
                    }}
                >
                    date
                </PillOptionButton>
                <ExpandButton
                    flipped={collapsed}
                    hasBackground={false}
                    onClick={() => { setCollapsed(!collapsed) }}
                    aria-label="Collapse bills"
                    size={'.95em'}
                />
            </div>
        </div>
    )
}

const Bills = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { isLoading } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
    const dispatch = useAppDispatch()
    const bills = useAppSelector(selectBills)
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        if (searchParams.get('bill-sort') === 'a-z') {
            dispatch(sortBillsByAlpha())
        } else if (searchParams.get('bill-sort') === 'date') {
            dispatch(sortBillsByDate())
        }
    }, [searchParams.get('bill-sort'), searchParams.get('day')])

    const Bills = () => (
        <div
            className='bills-box'
            style={{ '--number-of-bills': bills?.length! / 2 || 0 } as React.CSSProperties}
            aria-expanded={!collapsed}
        >
            {bills.filter(bill => new Date(bill.date).getDate() === (parseInt(searchParams.get('day')!) || new Date(bill.date).getDate()))
                .map((bill, i) => {
                    return (
                        <div
                            key={i} className={`${bill.period}ly-bill`}
                            role="button"
                            onClick={() => {
                                navigate(`${location.pathname}/bill${location.search}`, {
                                    state: { billId: bill.id }
                                })
                            }}
                        >
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                            <CheckMark2 style={{ opacity: bill?.is_paid ? 1 : .3 }} />
                        </div>
                    )
                })}
        </div>
    )

    const SkeletonBills = () => (
        <div
            className='bills-box'
            style={{ '--number-of-bills': 4 } as React.CSSProperties}
        >
            <>
                {Array.from(Array(8).keys()).map(i => (
                    <ShimmerText key={i} shimmering={true} style={{ width: '100%', height: '2em' }} />
                ))}
            </>
        </div>
    )

    return (
        <div id="bills-summary-window" className="window">
            <div className={`calendar-bills--container ${collapsed ? 'collapsed' : ''}`}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={() => setCollapsed(!collapsed)}
                />
                <div>
                    <Calendar />
                    {isLoading ? <SkeletonBills /> : <Bills />}
                </div>
            </div>
        </div>
    )
}

export default Bills
