import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useLazyGetTransactionsQuery } from '@features/transactionsSlice'


const CheckAllButton = () => (
    <Tooltip
        msg={"Confirm all"}
        ariaLabel={"Confirm all items"}
        style={{ left: '-1.3rem' }}
    >
        <IconButton
            id="check-all-icon"
            aria-label="Check all"
        >
            <CheckAll />
        </IconButton>
    </Tooltip>
)

const NewItemsHeader = () => {
    const [searchParams] = useSearchParams()
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const [fetchTransactions, { data: unconfirmedTransactions }] = useLazyGetTransactionsQuery()

    useEffect(() => {
        fetchTransactions({
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            confirmed: false,
            offset: offset,
            limit: limit,
        }, true)
    }, [searchParams.get('month')])

    return (
        <div id="needs-confirmation-header-container">
            <div id="needs-confirmation-header">
                <div>
                    <div id="number-of-items">
                        <span>{unconfirmedTransactions?.results.length || 0}</span>
                    </div>
                    <span>Items to confirm</span>
                </div>
                <div>
                    <RefreshButton hasBackground={false} />
                    <CheckAllButton />
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
