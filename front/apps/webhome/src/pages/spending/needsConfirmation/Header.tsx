import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'
import {
    useTransactionsSyncMutation,
    selectUnconfirmedLength
} from '@features/transactionsSlice'
import { Shimmer } from '@ledget/ui'


const CheckAllButton = () => (
    <Tooltip
        msg={"Confirm all"}
        ariaLabel={"Confirm all items"}
        style={{ left: '-1.3rem' }}
    >
        <IconButton id="check-all-icon" aria-label="Check all">
            <CheckAll />
        </IconButton>
    </Tooltip>
)

const NewItemsHeader = () => {
    const [searchParams] = useSearchParams()
    const { data: plaidItems } = useGetPlaidItemsQuery()
    const unconfirmedLength = useSelector(
        state => selectUnconfirmedLength(state, {
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear()
        })
    )
    const [syncTransactions, { isLoading: isSyncing }] = useTransactionsSyncMutation()

    const handleRefreshClick = () => {
        // sync everything
        for (const item of plaidItems || []) {
            syncTransactions({ item: item.id })
        }
    }

    return (
        <div id="needs-confirmation-header-container">
            <div id="needs-confirmation-header">
                <Shimmer shimmering={isSyncing} lightness={90} />
                <div>
                    <div id="number-of-items">
                        <span>
                            {unconfirmedLength > 99
                                ? '99'
                                : `${unconfirmedLength}`}
                        </span>
                    </div>
                    <span>{`Item${unconfirmedLength !== 1 ? 's' : ''}`} to confirm</span>
                </div>
                <div>
                    <RefreshButton hasBackground={false} onClick={handleRefreshClick} />
                    {(unconfirmedLength > 0) && <CheckAllButton />}
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
