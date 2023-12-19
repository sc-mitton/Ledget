import { useRef, Fragment, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'

import './styles/TransactionsTable.scss'
import TransactionModal from '@modals/TransactionItem'
import { useLazyGetTransactionsQuery, useGetTransactionsQuery, Transaction } from "@features/transactionsSlice"
import { Logo } from '@components/pieces'
import { DollarCents, InfiniteScrollDiv, TransactionShimmer, useColorScheme } from '@ledget/ui'
import { ShadowedContainer } from '@components/pieces'
import { EmptyListImage, ArrowIcon, EmptyListDark } from '@ledget/media'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { useAppSelector } from '@hooks/store'
import { selectFilteredFetchedConfirmedTransactions } from '@features/transactionsSlice'

const List = ({ setFocusedTransaction }:
  { setFocusedTransaction: React.Dispatch<React.SetStateAction<Transaction | undefined>> }) => {
  const { start, end } = useGetStartEndQueryParams()
  const { isDark } = useColorScheme()

  const { isError } = useGetTransactionsQuery({ confirmed: true, start, end })
  const transactionsData = useAppSelector(selectFilteredFetchedConfirmedTransactions)

  let monthholder: number | undefined
  let newMonth = false

  return (
    <>
      {(transactionsData && transactionsData?.length > 0 && !isError)
        ?
        transactionsData?.map((transaction) => {
          const date = new Date(transaction.datetime || transaction.date)
          date.getMonth() !== monthholder ? newMonth = true : newMonth = false
          monthholder = date.getMonth()

          return (
            <Fragment key={transaction.transaction_id}>
              <div>
                {newMonth && <div className="month-header">
                  {date.toLocaleString('default', { month: 'short', year: 'numeric' })}
                </div>}
              </div>
              <div
                role="button"
                onClick={() => setFocusedTransaction(transaction)}
              >
                <div>
                  <Logo accountId={transaction.account} />
                  <div className="left-info">
                    <div>{transaction.preferred_name || transaction.name}</div>
                    <div>
                      <span>
                        {dayjs(transaction.datetime || transaction.date).format('MM/DD')}
                      </span>
                      {transaction.categories?.map((category) => (
                        <span className={`emoji ${category.period}`}>
                          {category.emoji}
                        </span>
                      ))}
                      {transaction.bill &&
                        <span className={`emoji ${transaction.bill.period}`}>
                          {transaction.bill.emoji}
                        </span>}
                    </div>
                  </div>
                </div>
                <div>
                  <div><DollarCents value={transaction.amount} /></div>
                  <ArrowIcon
                    stroke={'currentColor'}
                    size={'.85em'}
                    strokeWidth={'18'}
                    rotation={-90}
                  />
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

export default function Table() {
  const [searchParams] = useSearchParams()
  const [isFetchingMore, setFetchingMore] = useState(false)
  const { start, end } = useGetStartEndQueryParams()
  const [focusedTransaction, setFocusedTransaction] = useState<Transaction>()

  const ref = useRef<HTMLDivElement>(null)
  const [getTransactions, { data: transactionsData, isLoading }] = useLazyGetTransactionsQuery()

  // Initial transaction fetch
  useEffect(() => {
    getTransactions({ confirmed: true, start, end }, true)
  }, [searchParams.get('month'), searchParams.get('year')])

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
    <>
      <ShadowedContainer className="transactions-history-table--container" >
        <InfiniteScrollDiv
          ref={ref}
          animate={isFetchingMore}
          className={`transactions-history--table ${isLoading ? 'skeleton' : ''}`}
          onScroll={handleScroll}
        >
          {!isLoading
            ? <>
              <List setFocusedTransaction={setFocusedTransaction} />
            </>
            : Array.from({ length: (ref.current ? ref.current.clientHeight : 0) / 65 }, (_, i) =>
              <Fragment key={i}>
                <div>
                  <TransactionShimmer />
                </div>
              </Fragment>
            )
          }
        </InfiniteScrollDiv>
      </ShadowedContainer >
      {focusedTransaction &&
        <TransactionModal
          item={focusedTransaction}
          onClose={() => setFocusedTransaction(undefined)}
        />}
    </>
  )
}
