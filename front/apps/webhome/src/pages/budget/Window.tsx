import { useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

import styles from './styles/window.module.scss'
import { SpendingCategories } from './categories-budget'
import { BudgetSummary as CarouselViewSummary } from './CarouselSummaryView'
import { BudgetSummary as CardsView } from './CardsSummaryView'
import { Bills } from './bills-budget'
import { MainWindow } from '@components/index'
import { setConfirmedTransactionFilter } from '@features/transactionsSlice'
import { useAppDispatch } from '@hooks/store'
import { useScreenContext } from '@ledget/ui'
import { SortProvider } from './context'

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
        <SortProvider>
            <MainWindow className={styles.window} data-size={screenSize}>
                {window.innerWidth > 700 ? <CardsView /> : <CarouselViewSummary />}
                <div>
                    <SpendingCategories />
                    <Bills />
                </div>
            </MainWindow>
            <Outlet />
        </SortProvider>
    )
}

export default Window
