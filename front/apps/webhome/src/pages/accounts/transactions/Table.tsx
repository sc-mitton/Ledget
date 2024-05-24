import { Fragment, useEffect, useState, HTMLProps, useRef } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'
import { Dayjs } from 'dayjs'

import './styles/Transactions.scss'
import { useLazyGetTransactionsQuery, GetTransactionsResponse } from '@features/transactionsSlice'
import {
    TransactionShimmer,
    InfiniteScrollDiv,
    ShadowScrollDiv,
    useLoaded,
    useScreenContext
} from '@ledget/ui'

import pathMappings from '../path-mappings'
import Filter from './Filter'

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
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>()

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
                ...(dateRange ? {
                    start: Math.floor(dateRange[0].valueOf() / 1000),
                    end: Math.floor(dateRange[1].valueOf() / 1000)
                } : {})
            }, true)
        }
    }, [searchParams.get('account'), dateRange])

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
                ...(dateRange ? { start_date: dateRange[0].format('YYYY-MM-DD'), end_date: dateRange[1].format('YYYY-MM-DD') } : {})
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
                className={`transactions-table ${screenSize !== 'extra-small' ? 'window' : 'naked-window'} ${isLoadingTransactions ? 'loading' : ''} ${screenSize} ${className || ''}`}
                ref={containerRef}
                {...rest}
            >
                <div className='transactions-table--header'>
                    <h3>Transactions</h3>
                    <Filter value={dateRange} onChange={setDateRange} />
                </div>
                <ShadowScrollDiv
                    className={`transactions-list  ${transactionsData ? 'not-skeleton' : ''} ${screenSize ? screenSize : ''} `}
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

export default Table
