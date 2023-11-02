import React, { useState, useEffect } from 'react'

import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionQueryState, GetTransactionsParams } from '@features/transactionsSlice'
import { EdgeGlowPillButton } from '@ledget/ui'

import pathMappings from './path-mappings'
import { AccountWafers, SkeletonWafers } from './AccountWafers'
import { TransactionsTable, Transactions } from './TransactionsTable'

const Deposits = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

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


    // Set first account on get accounts success
    useEffect(() => {
        if (isSuccessLoadingAccounts && accountsData?.accounts.length > 0) {
            searchParams.set('account', accountsData?.accounts[0].account_id)
            setSearchParams(searchParams)
        }
    }, [isSuccessLoadingAccounts])

    // Update transaction account query param when search param changes
    useEffect(() => {
        if (searchParams.get('account')) {
            setGetTransactionsParams((prev) => ({
                ...prev,
                account: searchParams.get('account') || ''
            }))
        }
    }, [searchParams.get('account')])

    // Fetch more transactions animation
    useEffect(() => {
        if (getTransactionsParams.offset! > 0 && isFetchingTransactions) {
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
                    onClick={() => setGetTransactionsParams({ ...getTransactionsParams, offset: 0 })}
                />
            }
            <TransactionsTable
                onScroll={(e) => handleScroll(e)}
                skeleton={isFetchingTransactions && getTransactionsParams.offset == 0 || isLoadingAccounts}
                className={`${fetchMorePulse ? 'fetching-more' : isLoadingTransactions ? 'loading' : ''}`}
            >
                {getTransactionsParams.account &&
                    <Transactions queryParams={getTransactionsParams} />}
            </TransactionsTable>
            <Outlet />
            {accountsData?.accounts.length === 0 &&
                <div className="add-accounts-btn--container" >
                    <h2>No Accounts Added Yet</h2>
                    <EdgeGlowPillButton onClick={() => { navigate('/profile/connections') }} >
                        Add account
                    </EdgeGlowPillButton>
                </div>
            }
        </>
    )
}

export default Deposits
