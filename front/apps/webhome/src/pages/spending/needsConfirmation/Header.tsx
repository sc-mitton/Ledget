import { FC, ButtonHTMLAttributes, useEffect } from 'react'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { popToast } from '@features/toastSlice'
import {
    useTransactionsSyncMutation,
    selectConfirmedLength,
    useGetTransactionsCountQuery
} from '@features/transactionsSlice'
import { Shimmer } from '@ledget/ui'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'


const CheckAllButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <Tooltip
        msg={"Confirm all"}
        ariaLabel={"Confirm all items"}
        style={{ left: '-1.1rem' }}
    >
        <IconButton id="check-all-icon" aria-label="Check all" {...props}>
            <CheckAll fill={'currentColor'} />
        </IconButton>
    </Tooltip>
)

const NewItemsHeader = (
    { onConfirmAll }: { onConfirmAll: () => void }
) => {
    const { start, end } = useGetStartEndQueryParams()
    const { data: tCountData } = useGetTransactionsCountQuery({ confirmed: false, start, end })
    const confirmedLength = useAppSelector(selectConfirmedLength)
    const [syncTransactions, {
        isLoading: isSyncing,
        isSuccess: isSyncSuccess,
        isError: isSyncError,
        data: syncResult
    }] = useTransactionsSyncMutation()
    const dispatch = useAppDispatch()

    const handleRefreshClick = () => {
        // sync everything
        syncTransactions({})
    }

    // Dispatch synced toast
    useEffect(() => {
        if (isSyncSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
                hasLoadingBar: true,
            }))
        }
    }, [isSyncSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isSyncError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
            }))
        }
    }, [isSyncError])

    return (
        <div id="needs-confirmation-header-container">
            <div id="needs-confirmation-header">
                <Shimmer shimmering={isSyncing} lightness={90} />
                <div>
                    {tCountData &&
                        <div id="number-of-items">
                            <span>
                                {(tCountData?.count - confirmedLength) > 99
                                    ? '99'
                                    : `${(tCountData?.count - confirmedLength)}`}
                            </span>
                        </div>}
                    <span>{`Item${((tCountData?.count || 0) - confirmedLength) !== 1 ? 's' : ''}`} to confirm</span>
                </div>
                <div>
                    <RefreshButton
                        fill={'currentColor'}
                        hasBackground={false}
                        loading={isSyncing}
                        onClick={handleRefreshClick}
                    />
                    {(((tCountData?.count || 0) - confirmedLength) > 0) &&
                        <CheckAllButton onClick={onConfirmAll} />
                    }
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
