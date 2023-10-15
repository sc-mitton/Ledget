import React, { useState, FC, useEffect, Fragment } from 'react'

import { useNavigate, Outlet } from 'react-router-dom'
import Big from 'big.js'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionsQuery, useTransactionsSyncMutation } from '@features/transactionsSlice'
import { ShimmerDiv, RefreshButton, Base64Image, DollarCents, ShimmerText } from '@ledget/ui'
import { popToast } from '@features/toastSlice'
import { useAppDispatch } from '@hooks/store'

const Wafers = ({ setCurrentAccount, currentAccount }: { setCurrentAccount: (account: string) => void, currentAccount: string }) => {
    const { data: accountsData, isSuccess, isLoading } = useGetAccountsQuery()

    useEffect(() => {
        isSuccess && setCurrentAccount(accountsData.accounts[0].account_id)
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
                            onClick={() => setCurrentAccount(account.account_id)}
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

const TransactionsTable: FC<React.HTMLProps<HTMLDivElement> & { shimmering: boolean }> = ({ children, shimmering = false, ...props }) => (
    <ShimmerDiv
        className="transactions--container"
        shimmering={shimmering}
        background="var(--inner-window)"
    >
        <div className="transactions--table" {...props}>
            {children}
        </div>
    </ShimmerDiv>
)

const TransactionShimmer = ({ shimmering = false }) => (
    <>
        <div />
        <div className="transaction-shimmer">
            <div>
                <ShimmerText shimmering={shimmering} length={25} />
                <ShimmerText shimmering={shimmering} length={10} />
            </div>
            <div>
                <ShimmerText shimmering={shimmering} length={10} />
            </div>
        </div>
    </>
)

const TransactionsHeader = () => (
    <div className="transactions--header">
        <div>Name</div>
        <div>Amount</div>
    </div>
)

const Transactions = ({ account, cursor, type }: { account: string, cursor: string, type: string }) => {
    const { data: { results: transactionsData } } = useGetTransactionsQuery({ type: 'depository', account: account, cursor: cursor })
    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()

    return transactionsData.map((transaction: any) => {
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
                    onClick={() => navigate(`/accounts/deposits/transaction/${transaction.transaction_id}`)}
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

const Deposits = () => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [paginationCursors, setPaginationCursors] = useState([''])
    const dispatch = useAppDispatch()

    const { isLoading: isLoadingAccounts } = useGetAccountsQuery()
    const [syncTransactions, { isSuccess, isError, data: syncResult }] = useTransactionsSyncMutation()
    const { isLoading: isloadingTransactions, data: getTransactionsResult } = useGetTransactionsQuery({
        type: 'depository',
        account: currentAccount,
        cursor: paginationCursors[paginationCursors.length - 1]
    })

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

    // Dispatch error toast
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
        if (bottom) {
            setPaginationCursors((prev) => [...prev, getTransactionsResult?.next])
        }
    }

    return (
        <>
            {isLoadingAccounts
                ?
                <SkeletonWafers />
                :
                <Wafers
                    setCurrentAccount={setCurrentAccount}
                    currentAccount={currentAccount}
                />
            }
            <TransactionsTable
                onScroll={(e) => handleScroll(e)}
                shimmering={isloadingTransactions && paginationCursors.length === 1}
            >
                <TransactionsHeader />
                {paginationCursors.map((cursor, index) => (
                    <Transactions key={index} cursor={cursor} account={currentAccount} type={'depository'} />
                ))}
                <TransactionShimmer shimmering={(Boolean(paginationCursors.length > 1))} />
            </TransactionsTable>
            <div className='refresh-btn--container' >
                <RefreshButton
                    loading={isloadingTransactions}
                    onClick={() => { syncTransactions(currentAccount) }}
                />
            </div>
            <Outlet />
        </>
    )
}

export default Deposits
