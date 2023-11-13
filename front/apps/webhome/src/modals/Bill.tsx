
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import './styles/Bill.scss'
import { withModal } from '@ledget/ui'
import { useGetBillsQuery } from '@features/billSlice'
import { DollarCents, getDaySuffix, mapWeekDayNumberToName, PrimaryTextButton } from '@ledget/ui'
import { CheckMark2 } from '@ledget/media'


const getRepeatsDescription = ({ day, week, week_day, month, year }:
    { day: number | undefined, week: number | undefined, week_day: number | undefined, month: number | undefined, year: number | undefined }) => {

    if (year && month && day) {
        return `One time on ${new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else if (month) {
        return `Yearly on ${new Date(2000, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    } else if (week_day && week) {
        return `The ${week_day}${getDaySuffix(week_day)} ${mapWeekDayNumberToName(week)} of the month`
    } else if (day) {
        return `The ${day}${getDaySuffix(day)} of every month`
    } else {
        return ''
    }
}

const getNextBillDate = ({ day, week, week_day, month, year }:
    { day: number | undefined, week: number | undefined, week_day: number | undefined, month: number | undefined, year: number | undefined }) => {
    let date = new Date()

    if (year && month && day) {
        return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (month && day) {
        date.setMonth(month)
        date.setDate(day)
        date.setFullYear(date.getFullYear() + 1)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (week_day && week) {
        date.setMonth(date.getMonth() + 1)
        date.setDate(1 + (week! - 1) * 7)
        date.setDate(date.getDate() + (week_day! - 1 - date.getDay() + 7) % 7)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else if (day) {
        date.setMonth(date.getMonth() + 1)
        date.setDate(day)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
}

const BillModal = withModal((props) => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const { data: bills } = useGetBillsQuery({
        month: searchParams.get('month') || undefined,
        year: searchParams.get('year') || undefined
    })
    const bill = bills?.find(bill => bill.id === location.state?.billId)

    console.log('bill', bill)
    return (
        <div id="bill-modal--content">
            <div className="header">
                {bill &&
                    <h2>
                        {bill.emoji}&nbsp;&nbsp;
                        {`${bill.name.charAt(0).toUpperCase()}${bill?.name.slice(1)}`}
                    </h2>}
                {bill &&
                    <div>
                        <CheckMark2 style={{ ...(!bill.is_paid && { opacity: .2 }) }} />
                        <div>
                            {bill.lower_amount && <><DollarCents value={bill.lower_amount} /> <span>&nbsp;-&nbsp;</span></>}
                            {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
                        </div>
                    </div>
                }
            </div>
            <div className="content">
                <div className="inner-window">
                    <div>Schedule</div>
                    <div>{getRepeatsDescription({
                        day: bill?.day,
                        week: bill?.week,
                        week_day: bill?.week_day,
                        month: bill?.month,
                        year: bill?.year
                    })}</div>
                    <div>Last Paid</div>
                    <div>

                    </div>
                    <div>Next</div>
                    <div>
                        {bill &&
                            <>
                                {bill?.is_paid
                                    ? `${getNextBillDate({
                                        day: bill?.day,
                                        week: bill?.week,
                                        week_day: bill?.week_day,
                                        month: bill?.month,
                                        year: bill?.year
                                    })}`
                                    : `${new Date(bill.date).toLocaleDateString(
                                        'en-US',
                                        { month: 'short', day: 'numeric', year: 'numeric' })}`
                                }
                            </>
                        }
                    </div>
                </div>
                <div>
                    <PrimaryTextButton>
                        Delete Bill
                    </PrimaryTextButton>
                </div>
            </div>
        </div>
    )
})

export default function Bill() {
    const navigate = useNavigate()

    return (
        <BillModal
            maxWidth={'24rem'}
            onClose={() => navigate(-1)}
        />
    )
}
