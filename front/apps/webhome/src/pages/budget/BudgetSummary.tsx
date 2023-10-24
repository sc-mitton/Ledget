
import './styles/BudgetSummary.scss'
import { DollarCents } from '@ledget/ui'
import { ThumbUp } from '@ledget/media'

const BudgetSummary = () => {
    return (
        <div className="inner-window" id="budget-summary--container">
            <div>
                <h4>total</h4>
            </div>
            <div className="summary-stats">
                <DollarCents value={380664} />
                <span>spent</span>
            </div>
            <div tabIndex={0}>
                <h4>monthly budget</h4>
                <div className="summary-stats monthly">

                </div>
            </div>
            <div className="summary-stats monthly">
                <DollarCents value={641364} />
                <span>left</span>
                <ThumbUp fill={'currentColor'} />
            </div>
            <div tabIndex={0}>
                <h4>yearly budget</h4>
                <div className="summary-stats yearly">

                </div>
            </div>
            <div className="summary-stats yearly" >
                <DollarCents value={641364} />
                <span>left</span>
                <ThumbUp fill={'currentColor'} />
            </div>
        </div>
    )
}

export default BudgetSummary
