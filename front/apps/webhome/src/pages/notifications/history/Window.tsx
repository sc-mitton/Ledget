import { useEffect, useState } from 'react'

import './styles/Window.scss'
import HistoryHeader from "./Header"
import TransactionsTable from './TransactionsTable'
import { useFilterFormContext } from '../context'


const Window = () => {
    const { showFilterForm } = useFilterFormContext()
    const [className, setClassName] = useState<'showing-filter-form' | 'not-showing-filter-form'>()

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (showFilterForm) {
            timeout = setTimeout(() => {
                setClassName('showing-filter-form')
            }, 300)
        } else {
            setClassName('not-showing-filter-form')
        }
    }, [showFilterForm])

    return (
        <div
            id="all-items-window"
            className={className}
        >
            <HistoryHeader />
            <TransactionsTable />
        </div>
    )
}

export default Window
