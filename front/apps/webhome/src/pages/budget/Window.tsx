import { useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

import './styles/Window.scss'
import BudgetSummary from './BudgetSummary'
import SpendingCategories from './SpendingCategories'
import Bills from './Bills'
import { setConfirmedTransactionFilter } from '@features/transactionsSlice'
import { useAppDispatch } from '@hooks/store'
import { useScreenContext } from '@context/context'
import Spending from '@pages/spending/Window'
import Footer from './Footer'

function Window() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useAppDispatch()
    const { screenSize } = useScreenContext()

    useEffect(() => {
        // On mount set month and date to current date and month
        if (!searchParams.get('month') || !searchParams.get('year')) {
            const year = sessionStorage.getItem(`budget-year`) || new Date().getFullYear()
            const month = sessionStorage.getItem(`budget-month`) || new Date().getMonth() + 1

            searchParams.set('month', `${month}`)
            searchParams.set('year', `${year}`)
        }

        setSearchParams(searchParams)
    }, [])

    // Update session store month and year when pathnames change
    useEffect(() => {
        const year = parseInt(searchParams.get('year') || `${new Date().getFullYear()}`)
        const month = parseInt(searchParams.get('month') || `${new Date().getMonth() + 1}`)
        sessionStorage.setItem(`budget-month`, `${month}`)
        sessionStorage.setItem(`budget-year`, `${year}`)

        // Dispatch filter
        dispatch(setConfirmedTransactionFilter({
            date_range: [
                Math.floor(new Date(year, month - 1, 1).getTime() / 1000),
                Math.floor(new Date(year, month, 0).getTime() / 1000)
            ]
        }))

    }, [searchParams.get('year'), searchParams.get('month')])

    return (
        <>
            <div id="budget-window" className={`main-window ${screenSize === 'small' ? 'small-screen' : ''}`}>
                <div>
                    <BudgetSummary />
                    <div>
                        <SpendingCategories />
                        <Bills />
                        <Footer />
                    </div>
                </div>
            </div>
            {screenSize === 'extra-large' && <Spending />}
            <Outlet />
        </>
    )
}

export default Window
