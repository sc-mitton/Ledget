
import { useSearchParams } from "react-router-dom"

import { useGetTransactionsQuery } from "@features/transactionsSlice"

const TransactionsTable = () => {
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
    <div>TransactionsTable</div>
  )
}

export default TransactionsTable
