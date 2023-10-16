import React, { useState, useEffect } from 'react'

import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useGetAccountsQuery } from "@features/accountsSlice"
import {
    useTransactionsSyncMutation,
    useGetTransactionQueryState,
    GetTransactionsParams
} from '@features/transactionsSlice'
import { RefreshButton, ZipperButton } from '@ledget/ui'
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'
import pathMappings from './path-mappings'
import { AccountWafers, SkeletonWafers } from './AccountWafers'
import { TransactionsTable, Transactions } from './TransactionsTable'

const Deposits = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const [getTransactionsParams, setGetTransactionsParams] = useState<GetTransactionsParams>({
        type: pathMappings.getTransactionType(location),
        account: '',
        offset: 0,
        limit: 25
    })
    const [fetchMorePulse, setFetchMorePulse] = useState(false)

    const {
        data: transactionsData,
        isLoading: isLoadingTransactions,
        isFetching: isFetchingTransactions,
    } = useGetTransactionQueryState(getTransactionsParams)
    const {
        data: accountsData,
        isLoading: isLoadingAccounts,
        isError: isErrorLoadingAccounts,
        isSuccess: isSuccessLoadingAccounts
    } = useGetAccountsQuery()
    const [syncTransactions,
        { isSuccess, isError, data: syncResult, isLoading: isSyncing }
    ] = useTransactionsSyncMutation()

    // Set first account on get accounts success
    useEffect(() => {
        if (isSuccessLoadingAccounts) {
            setGetTransactionsParams((prev) => ({ ...prev, account: accountsData?.accounts[0].account_id }))
        }
    }, [isSuccessLoadingAccounts])

    // Dispatch synced toast
    useEffect(() => {
        if (isSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
                timer: syncResult?.added ? 2500 : 2000,
                hasLoadingBar: false
            }))
        }
    }, [isSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
                timer: 2500,
                hasLoadingBar: false
            }))
        }
    }, [isError])

    // Fetch more transactions animation
    useEffect(() => {
        if (getTransactionsParams.offset > 0 && isFetchingTransactions) {
            setFetchMorePulse(true)
        }
        let timeout = setTimeout(() => {
            setFetchMorePulse(false)
        }, 1500)
        return () => { clearTimeout(timeout) }
    }, [isFetchingTransactions])

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
        // Update cursors to add new transactions node to the end
        if (bottom && transactionsData?.next !== undefined) {
            // Set offset to next cursor, unless there is no next cursor
            // in which case there is no more data to be fetched, and we
            // keep params as is
            setGetTransactionsParams((prev) => ({ ...prev, offset: transactionsData?.next || prev.offset }))
        }
    }

    return (
        <>
            {(isLoadingAccounts || isErrorLoadingAccounts)
                ? <SkeletonWafers />
                : <AccountWafers
                    onClick={(accountId) =>
                        setGetTransactionsParams({
                            ...getTransactionsParams,
                            account: accountId,
                            offset: 0
                        })
                    }
                />
            }
            <TransactionsTable
                onScroll={(e) => handleScroll(e)}
                skeleton={isLoadingTransactions || isLoadingAccounts}
                shimmering={isLoadingTransactions || isLoadingAccounts}
                className={`${fetchMorePulse ? 'fetching-more' : isLoadingTransactions ? 'loading' : ''}`}
            >
                {getTransactionsParams.account &&
                    <Transactions queryParams={getTransactionsParams} />}
            </TransactionsTable>
            {isSuccessLoadingAccounts && accountsData?.accounts.length > 0 &&
                <div className='refresh-btn--container' >
                    <RefreshButton
                        loading={isSyncing}
                        onClick={() => {
                            getTransactionsParams.account && syncTransactions(getTransactionsParams.account)
                        }}
                    />
                </div>}
            <Outlet />
            {accountsData?.accounts.length === 0 &&
                <div className="add-accounts-btn--container" >
                    <h2>No Accounts Added Yet</h2>
                    <ZipperButton onClick={() => { navigate('/profile/connections') }} >
                        Add account
                    </ZipperButton>
                </div>
            }
        </>
    )
}

export default Deposits
