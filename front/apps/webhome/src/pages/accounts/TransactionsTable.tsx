import { Fragment, useEffect, useState, FC, HTMLProps, useRef } from 'react'

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import Big from 'big.js'

import { useLazyGetTransactionsQuery, useGetTransactionQueryState } from '@features/transactionsSlice'
import { ShimmerText, DollarCents, InfiniteScrollDiv } from '@ledget/ui'
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

const getMaskImage = (string: 'top' | 'bottom' | 'bottom-top' | '') => {
    switch (string) {
        case 'top':
            return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 0px), transparent)'
        case 'bottom':
            return 'linear-gradient(to bottom, transparent 0%, black 0px, black calc(100% - 16px), transparent)'
        case 'bottom-top':
            return 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent)'
        default:
            return ''
    }
}

export const TransactionsTable: FC<HTMLProps<HTMLDivElement>>
    = ({ children, ...rest }) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const tableRef = useRef<HTMLDivElement>(null)
        const [shadow, setShadow] = useState<'top' | 'bottom' | 'bottom-top' | ''>('')
        const [fetchMorePulse, setFetchMorePulse] = useState(false)
        const [searchParams, setSearchParams] = useSearchParams()
        const [skeleton, setSkeleton] = useState(true)
        const [loaded, setLoaded] = useState(false)
        const location = useLocation()

        const [getTransactions, {
            data: transactionsData,
            isFetching: isFetchingTransactions,
            isLoading: isLoadingTransactions
        }] = useLazyGetTransactionsQuery()

        useEffect(() => {
            if (searchParams.get('offset')) {
                getTransactions({
                    account: searchParams.get('account') || '',
                    type: pathMappings.getTransactionType(location),
                    limit: parseInt(searchParams.get('limit') || '25'),
                    offset: parseInt(searchParams.get('offset') || '0'),
                }, searchParams.get('offset') !== `${transactionsData?.next}`)
                setLoaded(true)
            }
        }, [searchParams.get('offset')])

        useEffect(() => {
            if (searchParams.get('account')) {
                searchParams.set('offset', '0')
                searchParams.set('limit', '25')
                setSearchParams(searchParams)
            }
        }, [searchParams.get('account')])

        useEffect(() => {
            setSkeleton((isFetchingTransactions && searchParams.get('offset') === '0') && !searchParams.get('acount'))
        }, [searchParams.get('offset'), searchParams.get('account'), isFetchingTransactions])

        useEffect(() => {
            let timeout = setTimeout(() => {
                if (tableRef.current && tableRef.current) {
                    const { scrollTop, scrollHeight, offsetHeight } = tableRef.current
                    if (scrollTop === 0 && scrollHeight === offsetHeight) {
                        setShadow('')
                    } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
                        setShadow('bottom')
                    } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
                        setShadow('bottom-top')
                    } else if (scrollTop + offsetHeight === scrollHeight) {
                        setShadow('top')
                    }
                }
            }, 50)

            const handleScroll = (e: Event) => {
                if (tableRef.current && tableRef.current) {
                    const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLDivElement
                    if (scrollTop === 0 && scrollHeight === offsetHeight) {
                        setShadow('')
                    } else if (scrollTop === 0 && scrollHeight > offsetHeight) {
                        setShadow('bottom')
                    } else if (scrollTop > 0 && scrollTop + offsetHeight < scrollHeight) {
                        setShadow('bottom-top')
                    } else if (scrollTop + offsetHeight === scrollHeight) {
                        setShadow('top')
                    }
                }
            }
            tableRef.current?.addEventListener('scroll', handleScroll)
            return () => {
                tableRef.current?.removeEventListener('scroll', handleScroll)
                clearTimeout(timeout)
            }
        }, [skeleton])

        // Fetch more transactions animation
        useEffect(() => {
            if (isFetchingTransactions && searchParams.get('offset') !== '0') {
                isFetchingTransactions && setFetchMorePulse(true)
            }
            let timeout = setTimeout(() => {
                setFetchMorePulse(false)
            }, 1500)
            return () => { clearTimeout(timeout) }
        }, [isFetchingTransactions, searchParams.get('offset')])

        const handleScroll = (e: React.UIEvent<HTMLElement>) => {
            const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
            // Update cursors to add new transactions node to the end
            if (bottom && transactionsData?.next !== undefined) {
                // Set offset to next cursor, unless there is no next cursor
                // in which case there is no more data to be fetched, and we
                // keep params as is
                const offset = `${transactionsData?.next}` || searchParams.get('offset') || '0'
                searchParams.set('offset', offset)
                setSearchParams(searchParams)
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
                        <div
                            ref={tableRef}
                            style={{ maskImage: getMaskImage(shadow) }}
                            className='transactions--table not-skeleton'
                            onScroll={handleScroll}
                            {...rest}
                        >
                            {children}
                        </div>
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
