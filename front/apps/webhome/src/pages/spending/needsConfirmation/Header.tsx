import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'
import {
    useLazyGetUnconfirmedTransactionsQuery,
    selectConfirmedQueueLength,
    useTransactionsSyncMutation
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
    const [fetchTransactions, { data: unconfirmedTransactions }] = useLazyGetUnconfirmedTransactionsQuery()
    const [syncTransactions, { isLoading: isSyncing }] = useTransactionsSyncMutation()
    const { data: plaidItems } = useGetPlaidItemsQuery()

    const confirmedQueueLength = useSelector(selectConfirmedQueueLength)

    useEffect(() => {
        fetchTransactions({
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear(),
        }, true)
    }, [searchParams.get('month')])

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
                            {(unconfirmedTransactions?.results.length || 0) - confirmedQueueLength > 99
                                ? '99'
                                : (unconfirmedTransactions?.results.length || 0) - confirmedQueueLength}
                        </span>
                    </div>
                    <span>{`Item${(unconfirmedTransactions?.results.length || 0) > 1 ? 's' : ''}`} to confirm</span>
                </div>
                <div>
                    <RefreshButton hasBackground={false} onClick={handleRefreshClick} />
                    {(unconfirmedTransactions?.results.length! > 0) && <CheckAllButton />}
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
