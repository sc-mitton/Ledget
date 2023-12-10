
import './styles/Window.scss'
import HistoryHeader from "./Header"
import TransactionsTable from './TransactionsTable'
import { useFilterFormContext } from '../context'

const Window = () => {
    const { showFilterForm } = useFilterFormContext()

    return (
        <div id="all-items-window" className={`${showFilterForm ? 'showing-filter-form' : ''}`}>
            <HistoryHeader />
            <TransactionsTable />
        </div>
    )
}

export default Window
