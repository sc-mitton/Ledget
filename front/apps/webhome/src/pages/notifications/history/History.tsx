import { useEffect, useState, Fragment, useRef } from 'react'

import dayjs from 'dayjs'
import { ChevronRight } from '@geist-ui/icons'

import './styles/History.scss'
import { FilterForm } from './Filter'
import { setTransactionModal } from '@features/uiSlice'
import { useLazyGetTransactionsQuery, useGetTransactionsQuery } from "@features/transactionsSlice"
import { Logo } from '@components/pieces'
import { DollarCents, InfiniteScrollDiv, LoadingRingDiv, useColorScheme } from '@ledget/ui'
import { ShadowedContainer } from '@components/pieces'
import { EmptyListImage, EmptyListDark } from '@ledget/media'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import { selectFilteredFetchedConfirmedTransactions } from '@features/transactionsSlice'
import { useFilterFormContext } from '../context'

const List = () => {
    const { start, end } = useGetStartEndQueryParams()
    const { isDark } = useColorScheme()

    const { isError } = useGetTransactionsQuery(
        { confirmed: true, start, end },
        { skip: !start || !end })
    const transactionsData = useAppSelector(selectFilteredFetchedConfirmedTransactions)
    const dispatch = useAppDispatch()

    let monthholder: number | undefined
    let newMonth = false

    return (
        <>
            {(transactionsData && transactionsData?.length > 0 && !isError)
                ?
                transactionsData?.map((transaction) => {
                    const date = new Date(transaction.datetime || transaction.date)
                    date.getUTCMonth() !== monthholder ? newMonth = true : newMonth = false
                    monthholder = date.getMonth()

                    return (
                        <Fragment key={transaction.transaction_id}>
                            <div className="month-header">
                                {newMonth && <div>
                                    {date.toLocaleString('default', { month: 'short', year: 'numeric' })}
                                </div>}
                            </div>
                            <div role="button" onClick={() => dispatch(setTransactionModal({ item: transaction }))}>
                                <div><Logo accountId={transaction.account} size={'1.5em'} /></div>
                                <div>{transaction.preferred_name || transaction.name}</div>
                                <div>
                                    {dayjs(transaction.datetime || transaction.date).format('M/D')}
                                </div>
                                <div>
                                    {transaction.bill &&
                                        <span className={`emoji ${transaction.bill.period}`}>
                                            {transaction.bill.emoji}
                                        </span>}
                                    {transaction.categories?.map((category) => (
                                        <span className={`emoji ${category.period}`}>
                                            {category.emoji}
                                        </span>
                                    ))}
                                </div>
                                <div className={`${transaction.amount < 0 ? 'debit' : ''}`}>
                                    <div><DollarCents value={transaction.amount} /></div>
                                    <ChevronRight className="icon" />
                                </div>
                            </div>
                        </Fragment>
                    )
                })
                :
                <div
                    id="empty-list-icon--container"
                    key={'empty-list-icon--container'}
                >
                    {isDark ? <EmptyListDark /> : <EmptyListImage />}
                </div>
            }
        </>
    )
}

export function History() {
    const [isFetchingMore, setFetchingMore] = useState(false)
    const { start, end } = useGetStartEndQueryParams()
    const { showFilterForm } = useFilterFormContext()

    const ref = useRef<HTMLDivElement>(null)
    const [getTransactions, { data: transactionsData, isLoading }] = useLazyGetTransactionsQuery()

    // Initial transaction fetch
    useEffect(() => {
        if (!start || !end) return
        getTransactions({ confirmed: true, start, end }, true)
    }, [start, end])

    // Refetches for pagination
    const handleScroll = (e: any) => {
        setFetchingMore(true)
        const bottom = e.target.scrollTop === e.target.scrollTopMax
        // Update cursors to add new transactions node to the end
        if (bottom && transactionsData?.next) {
            getTransactions({
                confirmed: true,
                offset: transactionsData.next,
                limit: transactionsData.limit,
                start,
                end,
            })
        }
        setFetchingMore(false)
    }

    return (
        <div id="all-items-window" >
            {showFilterForm
                ? <FilterForm />
                : <ShadowedContainer className="transactions-history-table--container" >
                    <LoadingRingDiv loading={isLoading}>
                        <InfiniteScrollDiv
                            ref={ref}
                            animate={isFetchingMore}
                            className={`transactions-history--table ${isLoading ? 'skeleton' : ''}`}
                            onScroll={handleScroll}
                        >
                            <List />
                        </InfiniteScrollDiv>
                    </LoadingRingDiv>
                </ShadowedContainer >}
        </div>
    )
}
