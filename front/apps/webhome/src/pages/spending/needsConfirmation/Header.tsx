import { FC, ButtonHTMLAttributes, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import './styles/Header.scss'
import { CheckAll } from '@ledget/media'
import { IconButton, RefreshButton, Tooltip } from '@ledget/ui'
import { useAppDispatch } from '@hooks/store'
import { popToast } from '@features/toastSlice'
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
    const [searchParams] = useSearchParams()
    const unconfirmedLength = useSelector((state: RootState) =>
        selectUnconfirmedLength(state, {
            month: parseInt(searchParams.get('month')!) || new Date().getMonth() + 1,
            year: parseInt(searchParams.get('year')!) || new Date().getFullYear()
        })
    )
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
                        fill={'currentColor'}
                        hasBackground={false}
                        loading={isSyncing}
                        onClick={handleRefreshClick}
                    />
                    {(unconfirmedLength > 0) &&
                        <CheckAllButton onClick={onConfirmAll} />
                    }
                </div>
            </div>
        </div>
    )
}

export default NewItemsHeader
