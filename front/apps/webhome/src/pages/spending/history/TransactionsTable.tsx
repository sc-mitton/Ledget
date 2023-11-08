
import { useSearchParams } from "react-router-dom"

import './styles/TransactionsTable.scss'
import { useGetTransactionsQuery } from "@features/transactionsSlice"
import { Logo } from '@components/pieces'
import { DollarCents } from '@ledget/ui'

export default function Table() {
  const [searchParams] = useSearchParams()
  const { data: transactionsData, isLoading, isError } = useGetTransactionsQuery({
    confirmed: true,
    start: new Date(
      parseInt(searchParams.get('year')!) || new Date().getFullYear(),
      parseInt(searchParams.get('month')!) - 1 || new Date().getMonth()
    ).toISOString(),
    end: new Date(
      parseInt(searchParams.get('year')!) || new Date().getFullYear(),
      parseInt(searchParams.get('month')!) || new Date().getMonth(),
      0
    ).toISOString()
  })

  return (
    <div className="transactions-history--table">
      <>
        {transactionsData?.results.map((transaction) => (
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
              <DollarCents value={transaction.amount} />
            </div>
          </div>
        ))}
      </>
    </div>
  )
}
