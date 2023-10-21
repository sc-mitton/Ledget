import './styles/View.scss'

import { MonthlySummary, YearlySummary, MonthSummaryHeader, YearSummaryHeader } from './Summary'
import BudgetItemRows from './BudgetItemRows'

const ColumnarView = () => (
    <>
        <div className="columnar--view budget--header">
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
