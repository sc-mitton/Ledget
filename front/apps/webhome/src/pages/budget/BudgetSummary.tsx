
import './styles/BudgetSummary.scss'
import { DollarCents } from '@ledget/ui'
import { ThumbUp } from '@ledget/media'

const BudgetSummary = () => {
    return (
        <div id="budget-summary--container">
            <div>
                <h4>Total</h4>
            </div>
            <div tabIndex={0}>
                <h4>Monthly</h4>
            </div>
            <div tabIndex={0}>
                <h4>Yearly</h4>
            </div>

            <div>
                <div className="summary-stats">
                    <div>
                        <DollarCents value={380664} />
                    </div>
                    <div>
                        <span>spent</span>
                    </div>
                </div>
                <div className="summary-stats monthly">
                    <div>
                        <DollarCents value={641364} />
                    </div>
                    <div>
                        <span>left</span>
                        <ThumbUp fill={'currentColor'} />
                    </div>
                </div>
                <div className="summary-stats yearly" >
                    <div>
                        <DollarCents value={641364} />
                    </div>
                    <div>
                        <span>left</span>
                        <ThumbUp fill={'currentColor'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BudgetSummary
