import { Fragment, useEffect, useState, HTMLProps, useRef, FC, createContext, useContext } from 'react'

import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import Big from 'big.js'
import dayjs from 'dayjs'

import './styles/Transactions.scss'
import { useLazyGetTransactionsQuery, GetTransactionsResponse } from '@features/transactionsSlice'
import { setTransactionModal } from '@features/modalSlice'
import { useAppDispatch } from '@hooks/store'
import {
    TransactionShimmer,
    InfiniteScrollDiv,
    ShadowScrollDiv,
    useLoaded,
    Tooltip,
    useScreenContext,
    DollarCents
} from '@ledget/ui'
import pathMappings from './path-mappings'
import { Hourglass } from '@ledget/media'

type Props = Omit<HTMLProps<HTMLDivElement>, 'children'> & {
    children: ({ transactionsData }: { transactionsData?: GetTransactionsResponse }) => React.ReactNode
}

const Table = ({ children, className, ...rest }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [fetchMorePulse, setFetchMorePulse] = useState(false)
    const [searchParams] = useSearchParams()
    const loaded = useLoaded(0)
    const location = useLocation()
    const { screenSize } = useScreenContext()

    const [getTransactions, {
        data: transactionsData,
        isLoading: isLoadingTransactions,
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
                className={`transactions-table ${isLoadingTransactions ? 'loading' : ''} ${screenSize ? screenSize : ''} ${className || ''}`}
                ref={containerRef}
                {...rest}
            >
                <ShadowScrollDiv
                    className={`transactions-list ${transactionsData ? 'not-skeleton' : ''} ${screenSize ? screenSize : ''}`}
                    onScroll={handleScroll}
                >
                    {!transactionsData && Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                        .fill(0)
                        .map((_, index) =>
                            <Fragment key={`transaction-${index}`}>
                                <div />
                                <TransactionShimmer
                                    key={index}
                                    shimmering={true}
                                />
                            </Fragment>
                        )
                    }
                    {children({ transactionsData })}
                </ShadowScrollDiv>
            </InfiniteScrollDiv>
        </>
    )
}

const Transactions = () => {
    let previousMonth: number | null = null
    let previousYear: number | null = null
    const dispatch = useAppDispatch()

    return (
        <Table>
            {({ transactionsData }) => {
                return (
                    <>
                        {transactionsData &&
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
                                        <div>
                                            <span>{newMonth && `${date.toLocaleString('default', { month: 'short' })}`}</span>
                                            <span>{newYear && `${date.toLocaleString('default', { year: 'numeric' })}`}</span>
                                        </div>
                                        <div
                                            key={transaction.transaction_id}
                                            role="button"
                                            onClick={() => { dispatch(setTransactionModal({ item: transaction })) }}
                                        >
                                            <div>
                                                <div>
                                                    {transaction.pending &&
                                                        <Tooltip msg="Pending" type='right'><Hourglass className='icon' /></Tooltip>
                                                    }
                                                    <span>{transaction.preferred_name || transaction.name}</span>
                                                </div>
                                                <div>
                                                    <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                                    {transaction.categories?.map((c, index) => (
                                                        <span key={index}>{c.emoji}</span>))}
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
            }}
        </Table>
    )
}

export default function () {
    return (
        <>
            <Transactions />
            <Outlet />
        </>
    )
}
