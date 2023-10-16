import React, { useState, FC, HTMLProps, useEffect, Fragment } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useNavigate, Outlet, useLocation, Location } from 'react-router-dom'
import Big from 'big.js'

import { useGetAccountsQuery } from "@features/accountsSlice"
import {
    useLazyGetTransactionsQuery,
    useTransactionsSyncMutation,
    useGetTransactionQueryState,
    accountType,
    GetTransactionsParams
} from '@features/transactionsSlice'
import {
    ShimmerDiv,
    RefreshButton,
    Base64Image,
    DollarCents,
    ShimmerText,
    FadeInOutDiv
} from '@ledget/ui'
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'


const getTransactionType = (location: Location): string => {
    switch (location.pathname.split('/')[2]) {
        case 'deposits':
            return 'depository';
        case 'credit':
            return 'credit';
        case 'loan':
            return 'loan';
        default:
            return 'depository';
    }
}

const AccountWafers = ({ onClick }:
    { onClick: (val: string) => void }) => {
    const { data: accountsData, isSuccess } = useGetAccountsQuery()
    const [currentAccount, setCurrentAccount] = useState<string | null>(null)

    useEffect(() => {
        if (isSuccess) {
            setCurrentAccount(accountsData?.accounts[0].account_id)
        }
    }, [isSuccess])

    return (
        <div className="account-wafers--container">
            <div>
                <h3>Total Deposits</h3>
                <DollarCents
                    value={
                        isSuccess
                            ? String(accountsData?.accounts.filter((account: any) => account.type === 'depository')
                                .reduce((acc: number, account: any) => acc + account.balances.current, 0) * 100)
                            : '0.00'
                    }
                />
            </div>
            <div className="account-wafers">
                {accountsData?.accounts.filter((account: any) => account.type === 'depository').map((account: any, index: number) => {
                    const institution = accountsData.institutions.find((item: any) => item.id === account.institution_id)
                    const nameIsLong = account.official_name.length > 18

                    return (
                        <div
                            key={account.account_id}
                            className={`account-wafer ${currentAccount === account.account_id ? 'active' : 'inactive'}`}
                            style={{ '--wafer-index': index } as React.CSSProperties}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                onClick(account.account_id)
                                setCurrentAccount(account.account_id)
                            }}
                        >
                            <Base64Image
                                data={institution.logo}
                                alt={institution.name.charAt(0).toUpperCase()}
                            />
                            <div className={`wafer-name--container ${nameIsLong ? 'masked' : ''}`}>
                                <div className={`${nameIsLong ? 'scrolling-text' : ''}`}>
                                    {account.official_name}
                                </div>
                                {nameIsLong && <div className='scrolling-text'>{account.official_name}</div>}
                                {nameIsLong && <div className='spacer'>spacer</div>}
                            </div>
                            <div className='wafer-meta--container'>
                                {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                                &nbsp;&bull;&nbsp;&bull;&nbsp;
                                {account.mask}
                            </div>
                            <div className="wafer-balance--container">
                                <DollarCents value={String(account.balances.current * 100)} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const SkeletonWafers = () => (
    <div className="account-wafers--container">
        <div>
            <span>Total Deposits</span>
            <span>
                <DollarCents value="0" />
            </span>
        </div>
        <div className="shimmering-account-wafers">
            {Array(4).fill(0).map((_, index) => (
                <ShimmerDiv
                    key={index}
                    className="shimmering-account-wafer"
                    shimmering={true}
                    background="var(--inner-window-solid)"
                />
            ))}
        </div>
    </div>
)

const TransactionsHeader = () => (
    <div className="transactions--header">
        <div>Name</div>
        <div>Amount</div>
    </div>
)

const TransactionShimmer = () => (
    <>
        <div />
        <div className="transaction-shimmer">
            <div>
                <ShimmerText shimmering={true} length={25} />
                <ShimmerText shimmering={true} length={10} />
            </div>
            <div>
                <ShimmerText shimmering={true} length={10} />
            </div>
        </div>
    </>
)

const TransactionsTable: FC<HTMLProps<HTMLDivElement> & { shimmering: boolean }>
    = ({ children, shimmering, className, ...rest }) => {
        const containerRef = React.useRef<HTMLDivElement>(null)

        return (
            <div className={`transactions--container ${className}`} ref={containerRef}>
                <AnimatePresence mode="wait">
                    {shimmering
                        ? <FadeInOutDiv className='transactions--table' {...rest}>
                            <TransactionsHeader />
                            {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                                .fill(0)
                                .map((_, index) => <TransactionShimmer key={index} />)}
                        </FadeInOutDiv>
                        : <FadeInOutDiv className={`transactions--table ${className}`} {...rest}>
                            {children}
                        </FadeInOutDiv>
                    }
                </AnimatePresence>
            </div>
        )
    }

const Transactions = ({ getTransactionsParams }: { getTransactionsParams: GetTransactionsParams }) => {
    const [getTransactions, {
        data: transactionsData,
        isSuccess: isTransactionsSuccess,
    }] = useLazyGetTransactionsQuery()

    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()

    useEffect(() => {
        getTransactions({
            ...getTransactionsParams
        }, getTransactionsParams.offset === 0)
    }, [getTransactionsParams.offset, getTransactionsParams.account])

    return (
        <>
            <TransactionsHeader />
            {isTransactionsSuccess && transactionsData &&
                transactionsData.results?.map((transaction: any) => {
                    const date = new Date(transaction.datetime)
                    const currentMonth = date.getMonth()
                    const currentYear = date.getFullYear()
                    let newMonth = false
                    let newYear = false
                    if (currentMonth !== previousMonth) {
                        previousMonth = currentMonth
                        newMonth = true
                    }
                    if (currentYear !== previousYear) {
                        previousYear = currentYear
                        newYear = true
                    }

                    return (
                        <Fragment key={transaction.transaction_id}>
                            <div className={newMonth ? 'month-delimiter' : ''}>
                                <span>{newMonth && `${date.toLocaleString('default', { month: 'short' })}`}</span>
                                <span>{newYear && `${date.toLocaleString('default', { year: 'numeric' })}`}</span>
                            </div>
                            <div
                                key={transaction.id}
                                role="button"
                                onClick={() => {
                                    navigate(
                                        `/accounts/deposits/transaction/${transaction.transaction_id}`,
                                        { state: { getTransactionsParams: getTransactionsParams } }
                                    )
                                }}
                            >
                                <div>
                                    <span>{transaction.name}</span>
                                    <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div>
                                    <DollarCents
                                        value={Big(transaction.amount).times(100).toNumber()}
                                        style={{ textAlign: 'start' }}
                                        className={transaction.amount < 0 ? 'debit' : 'credit'}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )
                })
            }
        </>
    )
}

const Deposits = () => {

    const dispatch = useAppDispatch()
    const location = useLocation()

    const [getTransactionsParams, setGetTransactionsParams] = useState<GetTransactionsParams>({
        type: getTransactionType(location) as accountType,
        account: '',
        offset: 0,
        limit: 25
    })
    const [fetchMorePulse, setFetchMorePulse] = useState(false)

    const {
        data: transactionsData,
        isLoading: isLoadingTransactions,
        isFetching: isFetchingTransactions
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
                shimmering={isLoadingTransactions || isLoadingAccounts}
                className={`${fetchMorePulse ? 'fetching-more' : isLoadingTransactions ? 'loading' : ''}`}
            >
                {getTransactionsParams.account && <Transactions getTransactionsParams={getTransactionsParams} />}
            </TransactionsTable>
            <div className='refresh-btn--container' >
                <RefreshButton
                    loading={isSyncing}
                    onClick={() => {
                        getTransactionsParams.account && syncTransactions(getTransactionsParams.account)
                    }}
                />
            </div>
            <Outlet />
        </>
    )
}

export default Deposits
