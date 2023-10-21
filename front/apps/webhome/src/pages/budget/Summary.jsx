import './styles/Summary.css'
import { Recommendations as StarsIcon } from '@ledget/media'


const MonthSummaryHeader = () => {
    return (
        <div className="summary-header--container">
            <h3>
                Monthly&nbsp;
                <span>budget</span>
            </h3>
        </div>
    )
}

const YearSummaryHeader = () => {
    return (
        <div className="summary-header--container">
            <h3>
                Yearly&nbsp;
                <span>budget</span>
            </h3>
        </div>
    )
}

const MonthlySummary = () => {
    return (
        <div className="budget-summary--container">
            <div className="summary-stats--container">
                <div>
                    <div>
                        <span>$2432</span>
                        <span>spent in Aug</span>
                    </div>
                    <div>
                        <span>$300</span>
                        <span>left for Aug</span>
                    </div>
                    <div>
                        <StarsIcon
                            fill={'var(--green-dark4)'}
                            height={'1.8em'}
                            width={'1.8em'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const YearlySummary = () => {
    return (
        <div className="budget-summary--container">
            <div className="summary-stats--container">
                <div>
                    <div>
                        <span>$1137</span>
                        <span>spent in Aug</span>
                    </div>
                    <div>
                        <span>$4072</span>
                        <span>left for 2023</span>
                    </div>
                    <div>
                        <StarsIcon
                            height={'1.8em'}
                            width={'1.8em'}
                            fill={'var(--green-dark4)'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { YearlySummary, MonthlySummary, YearSummaryHeader, MonthSummaryHeader }
