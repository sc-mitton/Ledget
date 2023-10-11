import { useState, useEffect } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { withModal } from '@ledget/shared-utils'

const TransactionModal = withModal((props) => {
    const [item, setItem] = useState(null)
    const { data: transactionsData, isSuccess } = useGetTransactionsQuery()
    const { id } = useParams()

    useEffect(() => {
        isSuccess &&
            setItem(transactionsData.find(item => item.transaction_id === id))
    }, [isSuccess])

    return (
        <div>
            <h2>{item?.amount}</h2>
            <h4>{item?.name}</h4>
        </div>
    )
})

export default function () {
    const navigate = useNavigate()

    return (
        <TransactionModal
            onClose={() => navigate(-1)}
        />
    )
}
