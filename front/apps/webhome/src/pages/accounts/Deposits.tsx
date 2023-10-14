import { useState, useEffect, Fragment } from 'react'

import { useNavigate, Outlet } from 'react-router-dom'
import Big from 'big.js'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionsQuery, useTransactionsSyncMutation } from '@features/transactionsSlice'
import { ShimmerDiv, RefreshButton, Base64Image, DollarCents } from '@ledget/ui'
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

const Transactions = ({ currentAccount }: { currentAccount: string }) => {
    const { data: transactionsData } = useGetTransactionsQuery('depository')
    let previousMonth: number | null = null
    let previousYear: number | null = null
    const navigate = useNavigate()

    return (
        <div className="transactions--table">
            <div className="transactions--header">
                <div>Name</div>
                <div>Amount</div>
            </div>
            {transactionsData.filter((transaction: any) => currentAccount === transaction.account).map((transaction: any) => {
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
            })}
        </div>
    )
}

const Deposits = () => {
    const [currentAccount, setCurrentAccount] = useState('')
    const { isLoading: isloadingTransactions } = useGetTransactionsQuery('depository')
    const { isLoading: isLoadingAccounts } = useGetAccountsQuery()
    const [syncTransactions, { isSuccess, isError, data: syncResult }] = useTransactionsSyncMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess) {
            dispatch(popToast({
                type: 'success',
                message: `Synced${syncResult?.added ? `, ${syncResult?.added} new transactions` : ' successfully'}`,
                timer: syncResult?.added ? 2500 : 2000
            }))
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            dispatch(popToast({
                type: 'error',
                message: 'There was an error syncing your transactions',
                timer: 2500
            }))
        }
    }, [isError])

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
            <ShimmerDiv
                className="transactions--container"
                shimmering={isloadingTransactions}
                background="var(--inner-window)"
            >
                <Transactions currentAccount={currentAccount} />
            </ShimmerDiv>
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
