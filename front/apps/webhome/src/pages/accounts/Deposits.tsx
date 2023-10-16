import React, { useState, FC, HTMLProps, useEffect, Fragment } from 'react'

import { AnimatePresence } from 'framer-motion'
import { useNavigate, Outlet, useLocation, Location } from 'react-router-dom'
import Big from 'big.js'

import { useGetAccountsQuery } from "@features/accountsSlice"
import {
    useLazyGetTransactionsQuery,
    useTransactionsSyncMutation,
    useGetTransactionQueryState,
    accountType
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

const AccountWafers = ({ currentAccount, setCurrentAccount }:
    { currentAccount: string, setCurrentAccount: (val: string) => void }) => {
    const { data: accountsData, isSuccess } = useGetAccountsQuery()

    useEffect(() => {
        if (isSuccess) {
            setCurrentAccount(accountsData.accounts[0].account_id)
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
                            onClick={() => { setCurrentAccount(account.account_id) }}
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

const TransactionsTable: FC<HTMLProps<HTMLDivElement> & { shimmering: boolean }> = ({ children, shimmering, ...rest }) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    return (
        <div className="transactions--container" ref={containerRef}>
            <AnimatePresence mode="wait">
                {shimmering
                    ? <FadeInOutDiv className="transactions--table" {...rest}>
                        <TransactionsHeader />
                        {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                            .fill(0)
                            .map((_, index) => <TransactionShimmer key={index} />)}
                    </FadeInOutDiv>
                    : <FadeInOutDiv className="transactions--table" {...rest}>
                        {children}
                    </FadeInOutDiv>
                }
            </AnimatePresence>
        </div>
    )
}

const Transactions = ({ offset = 0, limit = 25, currentAccount = '' }) => {
    const location = useLocation()
    const [getTransactions, {
        data: transactionsData,
        isSuccess: isTransactionsSuccess,
        isFetching: isFetchingTransactions
    }] = useLazyGetTransactionsQuery()

    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()

    useEffect(() => {
        getTransactions({
            type: getTransactionType(location) as accountType,
            account: currentAccount,
            offset: offset,
            limit: limit
        }, offset === 0)
    }, [offset])

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
                                        {
                                            state: {
                                                reduxCacheKey: {
                                                    account: currentAccount,
                                                    type: getTransactionType(location)
                                                }
                                            }
                                        }
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
            {isFetchingTransactions && <><TransactionShimmer /><TransactionShimmer /></>}
        </>
    )
}

const transactionsFetchLimit = 25

const Deposits = () => {

    const dispatch = useAppDispatch()
    const location = useLocation()

    const [offset, setOffset] = useState(0)
    const [currentAccount, setCurrentAccount] = useState('')

    const {
        data: transactionsData,
        isLoading: isLoadingTransactions
    } = useGetTransactionQueryState({
        type: getTransactionType(location) as accountType,
        account: currentAccount,
        offset: offset,
        limit: transactionsFetchLimit
    })
    const {
        isLoading: isLoadingAccounts,
        isError: isErrorLoadingAccounts
    } = useGetAccountsQuery()
    const [syncTransactions,
        { isSuccess, isError, data: syncResult, isLoading: isSyncing }
    ] = useTransactionsSyncMutation()

    // Dispatch synced toast
    useEffect(() => {
        if (isSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
                timer: syncResult?.added ? 2500 : 2000
            }))
        }
    }, [isSuccess])

    // Dispatch synced error toast
    useEffect(() => {
        if (isError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
                timer: 2500
            }))
        }
    }, [isError])

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
        // Update cursors to add new transactions node to the end
        if (transactionsData?.next && bottom) {
            setOffset(offset + transactionsFetchLimit)
        }
    }

    return (
        <>
            {(isLoadingAccounts || isErrorLoadingAccounts)
                ? <SkeletonWafers />
                : <AccountWafers
                    setCurrentAccount={setCurrentAccount}
                    currentAccount={currentAccount}
                />
            }
            <TransactionsTable
                onScroll={(e) => handleScroll(e)}
                shimmering={isLoadingTransactions}
            >
                {currentAccount &&
                    <Transactions
                        currentAccount={currentAccount}
                        offset={offset}
                        limit={transactionsFetchLimit}
                    />}
            </TransactionsTable>
            <div className='refresh-btn--container' >
                <RefreshButton
                    loading={isSyncing}
                    onClick={() => {
                        const account = currentAccount as string
                        account && syncTransactions(account)
                    }}
                />
            </div>
            <Outlet />
        </>
    )
}

export default Deposits
