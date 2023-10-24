
import './styles/BudgetSummary.scss'

const BudgetSummary = () => {
    return (
        <div className="inner-window" id="budget-summary--container">
            <div>
                <h4>total</h4>
            </div>
            {/* <div className="summary-stats--container">
                    <span>$3,806</span>
                    <span>.64</span>
                    <span>spent</span>
                </div> */}
            <div>
                <h4>monthly budget</h4>
            </div>
            {/* <div className="summary-stats--container">
                    <span>$3,806</span>
                    <span>.64</span>
                    <span>left</span>
                </div> */}
            <div>
                <h4>yearly budget</h4>
            </div>
            {/* <div className="summary-stats--container">
                    <span>$6,413</span>
                    <span>.64</span>
                    <span>left</span>
                </div> */}
        </div>
    )
}

export default BudgetSummary
