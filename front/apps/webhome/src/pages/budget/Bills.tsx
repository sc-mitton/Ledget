import { useMemo, useEffect, useState, useRef, forwardRef } from 'react';

import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@hooks/store';
import { Plus, Calendar as CalendarIcon, CheckCircle, Circle, ChevronsDown } from '@geist-ui/icons'

import './styles/Bills.scss'
import {
    useGetBillsQuery,
    selectBills,
} from '@features/billSlice';
import {
    DollarCents,
    IconButton3,
    DropDownDiv,
    useAccessEsc,
    ShimmerText,
    BillCatLabel,
} from '@ledget/ui';
import { useScreenContext } from '@context/context';


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
                        <span>{day.getDate()}</span>
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
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedDate = new Date(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1,
    )
    const calendarRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

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
                <h4>
                    {selectedDate.toLocaleString('en-us', { month: 'short' }).toUpperCase()}&nbsp;
                    {selectedDate.getFullYear()} BILLS
                    {/* Bills */}
                </h4>
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
            </div>
            <div>
                <IconButton3
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand' : 'Collapse'}
                    className={`${collapsed ? 'rotated' : ''}`}
                >
                    <ChevronsDown className='icon' />
                </IconButton3>
            </div>
            <div>
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
                <DropDownDiv
                    placement='right'
                    visible={showCalendar}
                    ref={dropdownRef}
                    style={{ borderRadius: 'var(--border-radius25)' }}
                >
                    <Calendar ref={calendarRef} />
                </DropDownDiv>
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
    const bills = useAppSelector(selectBills)
    const { screenSize } = useScreenContext()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    return (
        <div
            className={`bills-box ${['extra-small'].includes(screenSize) ? 'small-screen' : ''}`}
            aria-expanded={!collapsed}
            style={{
                '--number-of-bills': bills?.length! / 2 || 0,
                ...(bills?.length <= 10 ? {} : {})
            } as React.CSSProperties}
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
                            <div className={`${bill.is_paid ? 'is_paid' : 'not_paid'}`}>
                                {bill.is_paid
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
    const [searchParams] = useSearchParams()
    const { isLoading } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })
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
