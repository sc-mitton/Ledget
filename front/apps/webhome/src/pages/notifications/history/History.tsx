import { useEffect, useState, Fragment } from 'react'

import dayjs from 'dayjs'
import { ChevronRight } from '@geist-ui/icons'

import './styles/History.scss'
import { FilterForm } from './Filter'
import { setTransactionModal } from '@features/modalSlice'
import { useLazyGetTransactionsQuery, useGetTransactionsQuery } from "@features/transactionsSlice"
import { InsitutionLogo, ZeroConfig } from '@components/pieces'
import { DollarCents, InfiniteScrollDiv, LoadingRingDiv, BillCatEmojiLabel } from '@ledget/ui'
import { ShadowedContainer } from '@components/pieces'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import { selectFilteredFetchedConfirmedTransactions } from '@features/transactionsSlice'
import { useFilterFormContext } from '../context'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'


export function History() {
    const [isFetchingMore, setFetchingMore] = useState(false)
    const { start, end } = useGetStartEndQueryParams()
    const { showFilterForm } = useFilterFormContext()

    const { isError } = useGetTransactionsQuery(
        { confirmed: true, start, end },
        { skip: !start || !end })
    const transactionsData = useAppSelector(selectFilteredFetchedConfirmedTransactions)
    const dispatch = useAppDispatch()
    const [getTransactions, { data: fetchedTransactionData, isLoading }] = useLazyGetTransactionsQuery()
    let monthholder: number | undefined
    let newMonth = false

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
        if (bottom && fetchedTransactionData?.next) {
            getTransactions({
                confirmed: true,
                offset: fetchedTransactionData.next,
                limit: fetchedTransactionData.limit,
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
                        {!transactionsData?.length && !isLoading && !isError
                            ? <ZeroConfig />
                            : <InfiniteScrollDiv
                                animate={isFetchingMore}
                                className={`transactions-history--table ${isLoading ? 'skeleton' : ''}`}
                                onScroll={handleScroll}
                            >
                                {transactionsData?.map((transaction) => {
                                    const date = new Date(transaction.datetime || transaction.date)
                                    date.getUTCMonth() !== monthholder ? newMonth = true : newMonth = false
                                    monthholder = date.getUTCMonth()
                                    return (
                                        <Fragment key={transaction.transaction_id}>
                                            <div className="month-header">
                                                {newMonth && <div>
                                                    {date.toLocaleString('default', { month: 'short', year: 'numeric' })}
                                                </div>}
                                            </div>
                                            <div role="button" onClick={() => dispatch(setTransactionModal({ item: transaction }))}>
                                                <div><InsitutionLogo accountId={transaction.account} size={'1.25em'} /></div>
                                                <div>{transaction.preferred_name?.slice(0, 20) || transaction.name.slice(0, 20)}
                                                    {`${(transaction.preferred_name && transaction.preferred_name?.length > 20) || transaction.name.length > 20 ? '...' : ''}`}</div>
                                                <div>
                                                    {dayjs(transaction.datetime || transaction.date).format('M/D/YYYY')}
                                                </div>
                                                <div>
                                                    {transaction.bill &&
                                                        <BillCatEmojiLabel emoji={transaction.bill.emoji} name={transaction.bill.name} />}
                                                    {transaction.categories?.map((category) => (
                                                        <BillCatEmojiLabel emoji={category.emoji} name={category.name} />))}
                                                </div>
                                                <div className={`${transaction.amount < 0 ? 'debit' : ''}`}>
                                                    <div><DollarCents value={transaction.amount} /></div>
                                                    <ChevronRight className="icon" />
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })}
                            </InfiniteScrollDiv>}
                    </LoadingRingDiv>
                </ShadowedContainer >}
        </div>
    )
}
