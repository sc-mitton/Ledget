import { Fragment, useEffect, useState, FC, HTMLProps, useRef, createContext, useContext } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'
import Big from 'big.js'
import dayjs from 'dayjs'

import TransactionModal from '@modals/TransactionItem'
import { useLazyGetTransactionsQuery, useGetTransactionQueryState, Transaction } from '@features/transactionsSlice'
import { TransactionShimmer, DollarCents, InfiniteScrollDiv, ShadowScrollDiv, useLoaded } from '@ledget/ui'
import pathMappings from './path-mappings'

const TransactionModalContent = createContext<{
    item: Transaction | undefined,
    setItem: (item: Transaction | undefined) => void,
}>({
    item: undefined,
    setItem: () => { },
})

const TransactionModalProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactionModalItem, setTransactionModalItem] = useState<Transaction>()

    const value = {
        item: transactionModalItem,
        setItem: setTransactionModalItem,
    }

    return (
        <TransactionModalContent.Provider value={value}>
            {children}
        </TransactionModalContent.Provider>
    )
}

const UnenrichedTable: FC<HTMLProps<HTMLDivElement>> = ({ children }) => {
    const { item: transactionModalItem, setItem: setTransactionModalItem } = useContext(TransactionModalContent)

    const containerRef = useRef<HTMLDivElement>(null)
    const [fetchMorePulse, setFetchMorePulse] = useState(false)
    const [searchParams] = useSearchParams()
    const [skeleton, setSkeleton] = useState(true)
    const loaded = useLoaded(0)
    const location = useLocation()

    const [getTransactions, {
        data: transactionsData,
        isFetching: isFetchingTransactions,
        isLoading: isLoadingTransactions,
        isSuccess: isTransactionsSuccess,
    }] = useLazyGetTransactionsQuery()

    // Initial fetch
    useEffect(() => {
        if (searchParams.get('account')) {
            getTransactions({
                account: searchParams.get('account') || '',
                type: pathMappings.getTransactionType(location),
                limit: 25,
                offset: 0,
            }, true)
        }
    }, [searchParams.get('account')])

    // Setting the skeleton view
    useEffect(() => {
        if (isTransactionsSuccess) {
            setSkeleton(false)
        } else {
            setSkeleton(true)
        }
    }, [isTransactionsSuccess])

    // Fetch more transactions
    const handleScroll = (e: any) => {
        const bottom = e.target.scrollTop === e.target.scrollTopMax
        // Update cursors to add new transactions node to the end
        if (bottom && transactionsData?.next !== null && transactionsData) {
            setFetchMorePulse(true)
            getTransactions({
                account: searchParams.get('account')!,
                type: pathMappings.getTransactionType(location),
                offset: transactionsData.next,
                limit: transactionsData.limit,
            })

            setTimeout(() => {
                setFetchMorePulse(false)
            }, 1500)
        }
    }

    return (
        <>
            <InfiniteScrollDiv
                animate={loaded && fetchMorePulse}
                className={`transactions--container ${isLoadingTransactions ? 'loading' : ''}`}
                ref={containerRef}
            >
                {skeleton
                    ?
                    <div className='transactions--table'>
                        {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                            .fill(0)
                            .map((_, index) =>
                                <><div /><TransactionShimmer key={index} shimmering={true} /></>
                            )
                        }
                    </div>
                    :
                    <ShadowScrollDiv
                        className='transactions--table not-skeleton'
                        onScroll={handleScroll}
                    >
                        {children}
                    </ShadowScrollDiv>
                }
            </InfiniteScrollDiv>
            {transactionModalItem &&
                <TransactionModal
                    item={transactionModalItem}
                    onClose={() => setTransactionModalItem(undefined)}
                />}
        </>
    )
}

export const TransactionsTable: FC<HTMLProps<HTMLDivElement>>
    = ({ children }) => {
        return (
            <TransactionModalProvider>
                <UnenrichedTable>
                    {children}
                </UnenrichedTable>
            </TransactionModalProvider>
        )
    }

export const Transactions = () => {
    const [searchParams] = useSearchParams()
    const { setItem: setTransactionModalItem } = useContext(TransactionModalContent)

    let previousMonth: number | null = null
    let previousYear: number | null = null
    const location = useLocation()

    const {
        data: transactionsData,
        isSuccess: isTransactionsSuccess,
    } = useGetTransactionQueryState({
        account: searchParams.get('account') || '',
        offset: parseInt(searchParams.get('offset') || '0'),
        limit: parseInt(searchParams.get('limit') || '25'),
        type: pathMappings.getTransactionType(location),
    })

    return (
        <>
            {isTransactionsSuccess && transactionsData &&
                transactionsData.results?.map((transaction) => {
                    const date = dayjs(transaction.datetime || transaction.date).toDate()
                    const currentMonth = date.getMonth()
                    const currentYear = date.getFullYear()
                    let newMonth = false
                    let newYear = false
                    if (currentMonth !== previousMonth) {
                        previousMonth = currentMonth
                        newMonth = true
                    }
                    if (currentYear !== previousYear) {
                        previousYear = currentYear
                        newYear = true
                    }

                    return (
                        <Fragment key={transaction.transaction_id}>
                            <div className={newMonth ? 'month-delimiter' : ''}>
                                <span>{newMonth && `${date.toLocaleString('default', { month: 'short' })}`}</span>
                                <span>{newYear && `${date.toLocaleString('default', { year: 'numeric' })}`}</span>
                            </div>
                            <div
                                key={transaction.transaction_id}
                                role="button"
                                onClick={() => setTransactionModalItem(transaction)}
                            >
                                <div>
                                    <span>{transaction.preferred_name || transaction.name}</span>
                                    <div>
                                        <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div>
                                        {transaction.categories?.map((c, index) => (
                                            <span key={index}>{c.emoji}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className={transaction.amount < 0 ? 'debit' : 'credit'}>
                                        <DollarCents
                                            value={Big(transaction.amount).times(100).toNumber()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                })
            }
        </>
    )
}
