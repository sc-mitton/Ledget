import { useRef, Fragment, useEffect, useState } from 'react'

import './styles/TransactionsTable.scss'
import { useGetMeQuery } from '@features/userSlice'
import { useLazyGetTransactionsQuery, useGetTransactionsQuery } from "@features/transactionsSlice"
import { Logo } from '@components/pieces'
import { DollarCents, InfiniteScrollDiv, TransactionShimmer } from '@ledget/ui'
import { ShadowedContainer } from '@components/pieces'
import { EmptyListImage } from '@ledget/media'
import { useGetStartEndFromSearchParams } from '@hooks/utilHooks'

const List = () => {
  const { data: user } = useGetMeQuery()
  const user_create_on = new Date(user?.created_on!)
  const { start, end } = useGetStartEndFromSearchParams()

  const { data: transactionsData, isError } = useGetTransactionsQuery({ confirmed: true, start, end })

  let monthholder: number | undefined
  let newMonth = false

  return (
    <>
      {(transactionsData && transactionsData.results?.length > 0 && !isError)
        ?
        transactionsData?.results.map((transaction) => {
          const date = new Date(transaction.datetime)
          date.getMonth() !== monthholder ? newMonth = true : newMonth = false
          monthholder = date.getMonth()

          return (
            <Fragment key={transaction.transaction_id}>
              <div>
                {newMonth && <div className="month-header">
                  {date.toLocaleString('default', { month: 'short', year: 'numeric' })}
                </div>}
              </div>
              <div>
                <div>
                  <Logo accountId={transaction.account} />
                  <div className="left-info">
                    <div>{transaction.preferred_name || transaction.name}</div>
                    <div>
                      <span>
                        {new Date(transaction.datetime).toLocaleDateString(
                          'en-us',
                          { year: 'numeric', month: 'numeric', day: 'numeric' })}
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
                </div>
              </div>
            </Fragment>
          )
        })
        :
        <div id="empty-list-icon--container" key={'empty-list-icon--container'}>
          <EmptyListImage />
        </div>
      }
    </>
  )
}

export default function Table() {
  const { data: user } = useGetMeQuery()
  const user_create_on = new Date(user?.created_on!)
  const [isFetchingMore, setFetchingMore] = useState(false)
  const { start, end } = useGetStartEndFromSearchParams()

  const ref = useRef<HTMLDivElement>(null)
  const [getTransactions, { data: transactionsData, isLoading }] = useLazyGetTransactionsQuery()

  // Initial transaction fetch
  useEffect(() => {
    getTransactions({ confirmed: true, start, end }, true)
  }, [])

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
    <ShadowedContainer className="transactions-history-table--container" >
      <InfiniteScrollDiv
        ref={ref}
        animate={isFetchingMore}
        className={`transactions-history--table ${isLoading ? 'skeleton' : ''}`}
        onScroll={handleScroll}
      >
        {!isLoading
          ? <><List /></>
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
  )
}
