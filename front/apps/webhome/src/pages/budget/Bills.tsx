
import { useSearchParams } from 'react-router-dom';

import './styles/BillsSummary.scss'
import { useGetBillsQuery } from '@features/billSlice';


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

    return (
        <div id="calendar">
            <div id="calendar--header">
                <h3>{selectedDate.toLocaleString('en-us', { month: 'long' })} {selectedDate.getFullYear()}</h3>
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
                            {data?.monthlyBills.some(bill => bill.day === day.getDate()) && <div className='has-bill-dot month' />}
                            {data?.yearlyBills.some(bill => bill.day === day.getDate()) && <div className='has-bill-dot year' />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const MonthlyBills = () => {
    const [searchParams] = useSearchParams()
    const { data } = useGetBillsQuery({
        month: searchParams.get('month') || `${new Date().getMonth() + 1}`,
        year: searchParams.get('year') || `${new Date().getFullYear()}`,
    })

    return (
        <div className="column">
            {data?.monthlyBills.map((bill, i) => {
                return (
                    <div key={i}>
                        <div>
                            <span>{bill.emoji}</span>
                            <span>{bill.name}</span>
                        </div>
                        <div>{bill.upper_amount}</div>
                    </div>
                )
            })}
        </div>
    )
}

const Bills = () => {
    return (
        <div id="bills-summary-window">
            <Calendar />
            <div>hello</div>
            <div>world</div>
        </div>
    )
}

export default Bills
