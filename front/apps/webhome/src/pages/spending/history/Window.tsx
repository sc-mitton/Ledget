
import '../styles/History.scss'
import HistoryHeader from "./Header"
import TransactionsTable from './TransactionsTable'

const Window = () => {
    return (
        <div id="all-items-window">
            <HistoryHeader />
            <TransactionsTable />
        </div>
    )
}

export default Window
