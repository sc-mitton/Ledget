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
    const { data } = useGetBillsQuery({
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

        return counts
    }, [data])

    const yearlyBillCountEachDay: number[] = useMemo(() => {
        const counts: number[] = Array(31).fill(0)

        return counts
    }, [data])

    return (
        <div id="calendar">
            <div id="calendar-header">
                <h3>Bills {selectedDate.toLocaleString('en-us', { month: 'short' })} {selectedDate.getFullYear()}</h3>
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
                        <div key={i}>
                            <div>{day.getDate()}</div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const Column: FC<{ period: 'month' | 'year' }> = ({ period }) => {
    const [searchParams] = useSearchParams()
    const { data } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <div className="column">
            {period === 'month'
                ?
                data?.monthlyBills.map((bill, i) => {
                    return (
                        <div key={i} className="monthly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })
                :
                data?.yearlyBills.map((bill, i) => {
                    return (
                        <div key={i} className="yearly-bill">
                            <div>
                                <span>{bill.emoji}</span>
                                <span>{bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}</span>
                            </div>
                            <div><DollarCents value={bill.upper_amount} /></div>
                        </div>
                    )
                })
            }
        </div>
    )
}

const Bills = () => {
    return (
        <div id="bills-summary-window">
            <div><Calendar /></div>
            <Column period='month' />
            <Column period='year' />
        </div>
    )
}

export default Bills
