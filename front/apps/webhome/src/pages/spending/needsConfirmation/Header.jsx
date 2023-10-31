import { useState } from 'react'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useGetUncomfirmedTransactionsQuery } from '@features/transactionsSlice'


const CheckAllButton = () => {

    return (
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
}

const NewItemsHeader = () => {
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const { data: unconfirmedTransactions } = useGetUncomfirmedTransactionsQuery({
        offset: offset,
        limit: limit,
    })

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
