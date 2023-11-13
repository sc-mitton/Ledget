
import { useNavigate, useLocation } from 'react-router-dom'

import './styles/Bill.scss'
import { withModal } from '@ledget/ui'
import { useGetBillsQuery } from '@features/billSlice'
import { DollarCents, getDaySuffix, mapWeekDayNumberToName } from '@ledget/ui'


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

const BillModal = withModal((props) => {
    const location = useLocation()
    const { data: bills } = useGetBillsQuery()
    const bill = bills?.find(bill => bill.id === location.state?.billId)

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
                        {bill.lower_amount && <><DollarCents value={bill.lower_amount} /> <span>&nbsp;-&nbsp;</span></>}
                        {bill.upper_amount && <DollarCents value={bill.upper_amount} />}
                    </div>
                }
            </div>
            <div className="content">
                <div className="inner-window">
                    <div>
                        <span>{getRepeatsDescription({
                            day: bill?.day,
                            week: bill?.week,
                            week_day: bill?.week_day,
                            month: bill?.month,
                            year: bill?.year
                        })}</span>
                    </div>
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
