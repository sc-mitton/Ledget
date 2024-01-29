import { HTMLProps, useState, useRef, useEffect } from 'react'

import { Bell } from '@geist-ui/icons'

import './Dropdown.scss'
import { DropDownDiv, useAccessEsc, RefreshButton, IconButton, Tooltip } from '@ledget/ui'
import { CheckAll } from '@ledget/media'
import { useGetTransactionsCountQuery, useTransactionsSyncMutation } from '@features/transactionsSlice'
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { NeedsConfirmationStack } from './needs-confirmation/Stack'
import { SpendingViewContextProvider } from './context'

const NotificationsDropdownMenu = (props: HTMLProps<HTMLDivElement>) => {
    const { start, end } = useGetStartEndQueryParams()
    const { data: tCountData } = useGetTransactionsCountQuery({ confirmed: false, start, end }, { skip: !start || !end })
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [syncTransactions, {
        isLoading: isSyncing,
        isSuccess: isSyncSuccess,
        isError: isSyncError,
        data: syncResult
    }] = useTransactionsSyncMutation()
    const dispatch = useAppDispatch()

    useAccessEsc({
        refs: [dropdownRef, buttonRef],
        visible: showDropdown,
        setVisible: setShowDropdown,
    })

    // Dispatch synced toast
    useEffect(() => {
        if (isSyncSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
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
        <SpendingViewContextProvider>
            <div style={{ position: 'relative' }} {...props} id='notifications-dropdown'>
                <button
                    ref={buttonRef}
                    className={`${tCountData?.count ? 'active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <Bell className='icon' />
                </button>
                <DropDownDiv
                    ref={dropdownRef}
                    placement='right'
                    arrow='right'
                    className='profile-dropdown'
                    visible={showDropdown}
                    style={{ borderRadius: '.75rem' }}
                >
                    <div className='header'>
                        <ul>
                            <li>
                                <span className='count'>{tCountData?.count}</span>
                                New Items
                            </li>
                            {/* <li>History</li> */}
                        </ul>
                        <div>
                            <Tooltip msg="Confirm all" ariaLabel="Confirm all">
                                <IconButton>
                                    <CheckAll />
                                </IconButton>
                            </Tooltip>
                            <RefreshButton
                                stroke={'currentColor'}
                                hasBackground={false}
                                loading={isSyncing}
                                onClick={() => syncTransactions({})}
                            />
                        </div>
                    </div>
                    <NeedsConfirmationStack />
                </DropDownDiv>
            </div>
        </SpendingViewContextProvider>
    )
}

export default NotificationsDropdownMenu
