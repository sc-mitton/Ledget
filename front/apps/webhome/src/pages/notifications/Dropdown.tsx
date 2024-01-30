import { HTMLProps, useState, useRef, useEffect, Fragment } from 'react'

import { Bell, Filter } from '@geist-ui/icons'
import { Tab } from '@headlessui/react'

import './Dropdown.scss'
import { DropDownDiv, useAccessEsc, RefreshButton, IconButton, Tooltip } from '@ledget/ui'
import { CheckAll } from '@ledget/media'
import { selectNotificationsTabIndex, setNotificationsTabIndex } from '@features/uiSlice'
import { useGetTransactionsCountQuery, useTransactionsSyncMutation } from '@features/transactionsSlice'
import { popToast } from '@features/toastSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useGetStartEndQueryParams } from '@hooks/utilHooks'
import { NeedsConfirmationStack } from './needs-confirmation/Stack'
import { History } from './history/History'
import { SpendingViewContextProvider, useFilterFormContext } from './context'

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
    const { setConfirmAll, setShowFilterForm, showFilterForm } = useFilterFormContext()
    const notificationTabIndex = useAppSelector(selectNotificationsTabIndex)
    const [tabIndex, setTabIndex] = useState(notificationTabIndex)

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

    // track tab index in redux
    useEffect(() => {
        tabIndex && dispatch(setNotificationsTabIndex(tabIndex))
    }, [tabIndex])

    return (
        <div style={{ position: 'relative' }} {...props} className='notifications-dropdown'>
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
                className='notifications-dropdown--menu'
                visible={showDropdown}
                style={{ borderRadius: '.75rem' }}
            >
                <Tab.Group as={Fragment} defaultIndex={tabIndex} onChange={setTabIndex}>
                    {({ selectedIndex }) => (
                        <>
                            <div className='header'>
                                <Tab.List as='ul'>
                                    <Tab as='li'>
                                        <span className='count'>{tCountData?.count}</span>
                                        New Items
                                    </Tab>
                                    <Tab as='li'>
                                        History
                                    </Tab>
                                </Tab.List>
                                <div>
                                    {selectedIndex === 0 && (
                                        <>
                                            <Tooltip msg="Confirm all" ariaLabel="Confirm all">
                                                <IconButton
                                                    onClick={() => setConfirmAll(true)}
                                                    disabled={tCountData?.count === 0}
                                                >
                                                    <CheckAll />
                                                </IconButton>
                                            </Tooltip>
                                            <RefreshButton
                                                stroke={'currentColor'}
                                                hasBackground={false}
                                                loading={isSyncing}
                                                onClick={() => syncTransactions({})}
                                            /></>)}
                                    {selectedIndex === 1 && (
                                        <>
                                            <Tooltip msg="Filter" ariaLabel="Filter">
                                                <IconButton
                                                    onClick={() => { setShowFilterForm(!showFilterForm) }}
                                                    disabled={tCountData?.count === 0}>
                                                    <Filter size={'1.125em'} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Tab.Panel>
                                <NeedsConfirmationStack />
                            </Tab.Panel>
                            <Tab.Panel>
                                <History />
                            </Tab.Panel>
                        </>
                    )}
                </Tab.Group>
            </DropDownDiv>
        </div>
    )
}

export default function (props: HTMLProps<HTMLDivElement>) {

    return (
        <SpendingViewContextProvider>
            <NotificationsDropdownMenu {...props} />
        </SpendingViewContextProvider>
    )
}
