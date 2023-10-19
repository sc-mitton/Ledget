import { Fragment, useEffect, useState, FC, HTMLProps, useRef } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import Big from 'big.js'

import { useLazyGetTransactionsQuery, GetTransactionsParams } from '@features/transactionsSlice'
import { ShimmerText, DollarCents } from '@ledget/ui'


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

export const TransactionsTable: FC<HTMLProps<HTMLDivElement> & { skeleton: boolean }>
    = ({ children, skeleton, className, ...rest }) => {
        const containerRef = useRef<HTMLDivElement>(null)

        return (
            <>
                <div className="transactions--header">
                    <div>Name</div>
                    <div>Amount</div>
                </div>
                <div
                    className={`transactions--container ${className}`}
                    ref={containerRef}
                >
                    {skeleton
                        ?
                        <div className='transactions--table' {...rest}>
                            {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                                .fill(0)
                                .map((_, index) => <TransactionShimmer key={index} shimmering={true} />)}
                        </div>
                        :
                        <div
                            className={`transactions--table not-skeleton ${className}`}
                            {...rest}
                        >
                            {children}
                        </div>
                    }
                </div>
            </>
        )
    }

export const Transactions = ({ queryParams }: { queryParams: GetTransactionsParams }) => {
    const [getTransactions, {
        data: transactionsData,
        isSuccess: isTransactionsSuccess,
    }] = useLazyGetTransactionsQuery()

    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        getTransactions({
            ...queryParams
        }, queryParams.offset === 0)
    }, [queryParams.offset, queryParams.account])

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
                                        {
                                            state: {
                                                getTransactionsParams: queryParams,
                                                transactionId: transaction.transaction_id,
                                            }
                                        }
                                    )
                                }}
                            >
                                <div>
                                    <span>{transaction.name}</span>
                                    <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div>
                                    <DollarCents
                                        value={Big(transaction.amount).times(100).toNumber()}
                                        style={{ textAlign: 'start' }}
                                        className={transaction.amount < 0 ? 'debit' : 'credit'}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )
                })
            }
        </>
    )
}
