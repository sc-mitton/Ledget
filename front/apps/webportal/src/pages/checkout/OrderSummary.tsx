import dayjs from 'dayjs'

import styles from './styles/order-summary.module.scss'
import { DollarCents } from '@ledget/ui'


const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1:
            return "st"
        case 2:
            return "nd"
        case 3:
            return "rd"
        default:
            return "th"
    }
}

const OrderSummary = ({ unit_amount, trial_period_days }: { unit_amount?: number, trial_period_days?: number }) => {
    const firstCharge = dayjs().add(trial_period_days || 0, 'day')

    return (
        <div className={styles.orderSummary}>
            <table>
                <tbody>
                    <tr>
                        <td>First Charge:</td>
                        <td>{firstCharge.format('MMM, D')}{getDaySuffix(firstCharge.date())}</td>
                    </tr>
                    <tr>
                        <td>Amount:</td>
                        <td><DollarCents value={unit_amount || 0} /></td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

export default OrderSummary
