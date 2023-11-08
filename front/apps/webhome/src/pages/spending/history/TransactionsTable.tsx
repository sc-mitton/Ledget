import { useRef, Fragment } from 'react'

import './styles/TransactionsTable.scss'
import { useGetMeQuery } from '@features/userSlice'
import { useGetTransactionsQuery } from "@features/transactionsSlice"
import { Logo } from '@components/pieces'
import { DollarCents, ShadowScrollDiv, TransactionShimmer } from '@ledget/ui'
import { EmptyListImage } from '@ledget/media'


const List = () => {
  const { data: user } = useGetMeQuery()
  const user_create_on = new Date(user?.created_on!)
  let end = new Date()

  const { data: transactionsData, isError } = useGetTransactionsQuery({
    confirmed: true,
    start: Math.floor(user_create_on.setFullYear(user_create_on.getFullYear() - 2) / 1000),
    end: Math.floor(end.setHours(24, 0, 0, 0) / 1000)
  })

  let monthholder: number | undefined

  return (
    <>
      {(transactionsData && transactionsData.results?.length > 0 && !isError)
        ?
        transactionsData?.results.map((transaction) => {

          return (
            <div>
              <div>
                <Logo accountId={transaction.account} />
                <div className="left-info">
                  <div>{transaction.preferred_name || transaction.name}</div>
                  <div>
                    <span>
                      {new Date(transaction.date).toLocaleDateString(
                        'en-us',
                        { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </span>
                    {transaction.categories?.map((category) => (
                      <span className={`emoji ${category.period}`}>
                        {category.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div><DollarCents value={transaction.amount} /></div>
              </div>
            </div>
          )
        })
        :
        <div id="empty-list-icon--container">
          <EmptyListImage />
        </div>
      }
    </>
  )
}

export default function Table() {
  const { data: user } = useGetMeQuery()
  const user_create_on = new Date(user?.created_on!)
  let end = new Date()

  const { isLoading } = useGetTransactionsQuery({
    confirmed: true,
    start: Math.floor(user_create_on.setFullYear(user_create_on.getFullYear() - 2) / 1000),
    end: Math.floor(end.setHours(24, 0, 0, 0) / 1000)
  })

  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="transactions-history-table--container" ref={ref}>
      <ShadowScrollDiv className={`transactions-history--table ${isLoading ? 'skeleton' : ''}`}>
        {!isLoading
          ? <List />
          : Array.from({ length: (ref.current ? ref.current.clientHeight : 0) / 65 }, (_, i) =>
            <Fragment key={i}>
              <div>
                <TransactionShimmer />
              </div>
            </Fragment>
          )
        }
      </ShadowScrollDiv>
    </div>
  )
}
