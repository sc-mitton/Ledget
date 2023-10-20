import './styles/View.css'
import MonthlySummary from './MonthlySummary'
import YearlySummary from './YearlySummary'
import { MonthSummaryHeader, YearSummaryHeader } from './SummaryHeaders'
import BudgetItemRows from './BudgetItemRows'

const ColumnarView = () => (
    <>
        <div className="columnar--view">
            <div>
                <MonthSummaryHeader />
                <MonthlySummary />
            </div>
            <div >
                <YearSummaryHeader />
                <YearlySummary />
            </div>
        </div>
        <div className="columnar--view budget--content">
            <div>
                <BudgetItemRows period="month" />
            </div>
            <div >
                <BudgetItemRows period="year" />
            </div>
        </div>
    </>
)

export default ColumnarView
