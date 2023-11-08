import { Fragment, useEffect, useState, FC, HTMLProps, useRef } from 'react'

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import { useLazyGetTransactionsQuery, useGetTransactionQueryState } from '@features/transactionsSlice'
import { ShimmerText, DollarCents, InfiniteScrollDiv, ShadowScrollDiv } from '@ledget/ui'
import pathMappings from './path-mappings'


export const TransactionShimmer = ({ shimmering = true }) => (
    <>
        <div />
        <div className="transaction-shimmer">
            <div>
                <ShimmerText lightness={90} shimmering={shimmering} length={25} />
                <ShimmerText lightness={90} shimmering={shimmering} length={10} />
            </div>
            <div>
                <ShimmerText lightness={90} shimmering={shimmering} length={10} />
            </div>
        </div>
    </>
)


export const TransactionsTable: FC<HTMLProps<HTMLDivElement>>
    = ({ children, ...rest }) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const [fetchMorePulse, setFetchMorePulse] = useState(false)
        const [searchParams] = useSearchParams()
        const [skeleton, setSkeleton] = useState(true)
        const [loaded, setLoaded] = useState(false)
        const location = useLocation()

        const [getTransactions, {
            data: transactionsData,
            isFetching: isFetchingTransactions,
            isLoading: isLoadingTransactions
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
                setLoaded(true)
            }
        }, [searchParams.get('account')])

        // Setting the skeleton view
        useEffect(() => {
            setSkeleton((isLoadingTransactions) && !searchParams.get('acount'))
        }, [searchParams.get('account'), isLoadingTransactions])



        // Fetch more transactions animation
        useEffect(() => {
            if (isFetchingTransactions && !isLoadingTransactions) {
                setFetchMorePulse(true)
            }
            let timeout = setTimeout(() => {
                setFetchMorePulse(false)
            }, 1500)
            return () => { clearTimeout(timeout) }
        }, [isFetchingTransactions])

        // Fetch more transactions
        const handleScroll = (e: React.UIEvent<HTMLElement>) => {
            const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
            // Update cursors to add new transactions node to the end
            if (bottom && transactionsData?.next !== null && transactionsData) {
                getTransactions({
                    account: searchParams.get('account')!,
                    type: pathMappings.getTransactionType(location),
                    offset: transactionsData.next,
                    limit: transactionsData.limit,
                })
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
                        <div
                            className='transactions--table'
                            {...rest}
                        >
                            {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                                .fill(0)
                                .map((_, index) => <TransactionShimmer key={index} shimmering={true} />)}
                        </div>
                        :
                        <ShadowScrollDiv
                            className='transactions--table not-skeleton'
                            onScroll={handleScroll}
                            {...rest}
                        >
                            {children}
                        </ShadowScrollDiv>
                    }
                </InfiniteScrollDiv>
            </>
        )
    }

export const Transactions = () => {
    const [searchParams] = useSearchParams()

    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()
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
                transactionsData.results?.map((transaction: any) => {
                    const date = new Date(transaction.datetime)
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
                                key={transaction.id}
                                role="button"
                                onClick={() => {
                                    navigate(
                                        `${location.pathname}/transaction${location.search}`,
                                        { state: { getTransactionsParams: location.search, transactionId: transaction.transaction_id } }
                                    )
                                }}
                            >
                                <div>
                                    <span>{transaction.preferred_name || transaction.name}</span>
                                    <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
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
