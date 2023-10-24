
import './styles/BudgetSummary.scss'
import { DollarCents } from '@ledget/ui'
import { ThumbUp } from '@ledget/media'

const BudgetSummary = () => {
    return (
        <div className="inner-window" id="budget-summary--container">
            <div>
                <h4>total</h4>
                <div className="summary-stats--container">

                </div>
            </div>
            <div>
                <DollarCents value={380664} />
                <span>spent</span>
            </div>
            <div>
                <h4>monthly budget</h4>
                <div className="summary-stats--container">

                </div>
            </div>
            <div>
                <DollarCents value={641364} />
                <span>left</span>
                <ThumbUp />
            </div>
            <div>
                <h4>yearly budget</h4>
                <div className="summary-stats--container">

                </div>
            </div>
            <div>
                <DollarCents value={641364} />
                <span>left</span>
                <ThumbUp />
            </div>
        </div>
    )
}

export default BudgetSummary
