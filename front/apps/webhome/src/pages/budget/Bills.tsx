import { FC, useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import './styles/BillsSummary.scss'
import { useGetBillsQuery } from '@features/billSlice';
import { DollarCents } from '@ledget/ui';


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

const Calendar = () => {
    const [searchParams] = useSearchParams()
    const { data: billsData } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    const selectedDate = new Date(
        parseInt(searchParams.get('year') || `${new Date().getFullYear()}`),
        parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`) - 1,
    )

    const days = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1)

    const monthlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = billsData?.length || 0
        for (let i = 0; i < numBills; i++) {
            if (billsData![i].period !== 'month') {
                continue
            }
            const date = new Date(billsData![i].date!)
            counts[date.getDate() - 1] += 1
        }
        return counts
    }, [billsData])

    const yearlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)
        const numBills = billsData?.length || 0
        for (let i = 0; i < numBills; i++) {
            if (billsData![i].period !== 'year') {
                continue
            }
            const date = new Date(billsData![i].date!)
            counts[date.getDate() - 1] += 1
        }
        return counts
    }, [billsData])

    return (
        <div id="calendar">
            <div id="calendar-header">
                <h3>{selectedDate.toLocaleString('en-us', { month: 'short' })} {selectedDate.getFullYear()} Bills</h3>
            </div>
            <div>
                <div>Su</div>
                <div>M</div>
                <div>Tu</div>
                <div>W</div>
                <div>Th</div>
                <div>F</div>
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
                            className={`${monthlyBillCountEachDay[i] > 1 || yearlyBillCountEachDay[i] > 1 ? 'hoverable' : ''}`}
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
                            {monthlyBillCountEachDay[i] > 0 && <span className="has-bill-dot month" />}
                            {yearlyBillCountEachDay[i] > 0 && <span className="has-bill-dot year" />}
                        </div>
                    )
                })}
            </div >
        </div >
    )
}

const Bills = () => {
    const [searchParams] = useSearchParams()
    const { data: billsData } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <div>
            <div id="bills-summary-window">
                <div><Calendar /></div>
                {/* <div className="bills-box">
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
                {billsData?.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                                <span>
                                    {new Date(bill.date).toLocaleString('en-us', { month: 'numeric', day: 'numeric' }).replace('/', '-')}
                                </span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })}
            </div> */}
            </div>
        </div>
    )
}

export default Bills
