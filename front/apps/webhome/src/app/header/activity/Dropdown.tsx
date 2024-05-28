import { HTMLProps, useState, useRef, useEffect, Fragment } from 'react'

import { Activity, Filter } from '@geist-ui/icons'
import { Tab } from '@headlessui/react'

import './Dropdown.scss'
import { DropdownDiv, useAccessEsc, RefreshButton, IconButton, Tooltip, TabNavListUnderlined } from '@ledget/ui'
import { CheckAll } from '@ledget/media'
import { selectNotificationsTabIndex, setNotificationsTabIndex } from '@features/uiSlice'
import { useGetTransactionsCountQuery, useTransactionsSyncMutation } from '@features/transactionsSlice'
import { popToast } from '@features/toastSlice'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { NeedsConfirmationStack } from './needs-confirmation/Stack'
import { History } from './history/History'
import { SpendingViewContextProvider, useFilterFormContext } from './context'

const ActivityDropdown = (props: HTMLProps<HTMLDivElement>) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: tCountData } = useGetTransactionsCountQuery({ confirmed: false, month, year }, { skip: !month || !year })
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
                <Activity className='icon' stroke={'var(--white)'} />
            </button>
            <DropdownDiv
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
                                <TabNavListUnderlined selectedIndex={selectedIndex}>
                                    <Tab>
                                        {tCountData?.count! > 0 &&
                                            <span className='count'>{tCountData?.count}</span>}
                                        New Items
                                    </Tab>
                                    <Tab>History</Tab>
                                    <div className='actions'>
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
                                                    <IconButton onClick={() => setShowFilterForm(!showFilterForm)}>
                                                        <Filter size={'1.125em'} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </div>
                                </TabNavListUnderlined>
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
            </DropdownDiv>
        </div>
    )
}

export default function (props: HTMLProps<HTMLDivElement>) {

    return (
        <SpendingViewContextProvider>
            <ActivityDropdown {...props} />
        </SpendingViewContextProvider>
    )
}
