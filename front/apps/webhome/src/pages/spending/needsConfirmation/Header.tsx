import { FC, ButtonHTMLAttributes } from 'react'
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
import { RootState } from '@features/store'
import { Shimmer } from '@ledget/ui'


const CheckAllButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <Tooltip
        msg={"Confirm all"}
        ariaLabel={"Confirm all items"}
        style={{ left: '-1.3rem' }}
    >
        <IconButton id="check-all-icon" aria-label="Check all" {...props}>
            <CheckAll fill={'var(--faded-text)'} />
        </IconButton>
    </Tooltip>
)

const NewItemsHeader = (
    { onConfirmAll }: { onConfirmAll: () => void }
) => {
    const [searchParams] = useSearchParams()
    const { data: plaidItems } = useGetPlaidItemsQuery()
    const unconfirmedLength = useSelector((state: RootState) =>
        selectUnconfirmedLength(state, {
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
                    <RefreshButton
                        fill={'var(--faded-text)'}
                        hasBackground={false}
                        onClick={handleRefreshClick}
                    />
                    {(unconfirmedLength > 0) &&
                        <CheckAllButton
                            onClick={onConfirmAll}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
