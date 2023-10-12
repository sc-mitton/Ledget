import { useState, useEffect, Fragment } from 'react'

import { useNavigate, Outlet } from 'react-router-dom'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { Base64Logo, DollarCents } from '@components/pieces'
import { ShimmerDiv, Shimmer } from '@ledget/shared-ui'

const Wafers = ({ setCurrentAccount, currentAccount }) => {
    const { data: accountsData, isSuccess, isLoading } = useGetAccountsQuery()

    useEffect(() => {
        isSuccess && setCurrentAccount(accountsData.accounts[0].account_id)
    }, [isSuccess])

    return (
        <div className="account-wafers--container">
            <div>
                <span>Total Deposits</span>
                <span>
                    <DollarCents value={
                        String(accountsData?.accounts.filter(account => account.type === 'depository')
                            .reduce((acc, account) => acc + account.balances.current, 0) * 100)
                    }
                    />
                </span>
            </div>
            <div className="account-wafers">
                {accountsData?.accounts.filter(account => account.type === 'depository').map(account => {
                    const institution = accountsData.institutions.find(item => item.id === account.institution_id)
                    const nameIsLong = account.official_name.length > 18

                    return (
                        <div
                            key={account.account_id}
                            className={`account-wafer ${currentAccount === account.account_id ? 'active' : 'inactive'}`}
                            shimmering={isLoading}
                            background="var(--logo-dark)"
                            role="button"
                            tabIndex={0}
                            onClick={() => setCurrentAccount(account.account_id)}
                        >
                            <Base64Logo
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
            {Array(4).fill().map((_, index) => (
                <ShimmerDiv
                    className="shimmering-account-wafer"
                    shimmering={true}
                    background="var(--inner-window-solid)"
                />
            ))}
        </div>
    </div>
)

const Transactions = ({ currentAccount }) => {
    const { data: transactionsData } = useGetTransactionsQuery('depository')
    let previousMonth = null
    const navigate = useNavigate()

    return (
        <div className="transactions--table">
            <div className="transactions--header">
                <div>Name</div>
                <div>Amount</div>
            </div>
            {transactionsData.filter(transaction => currentAccount === transaction.account).map((transaction) => {
                const date = new Date(transaction.datetime)
                const currentMonth = date.getMonth()
                let newMonth = false
                if (currentMonth !== previousMonth) {
                    previousMonth = currentMonth
                    newMonth = true
                }

                return (
                    <Fragment key={transaction.transaction_id}>
                        <div className={newMonth ? 'month-delimiter' : ''}>
                            {newMonth && `${date.toLocaleString('default', { month: 'short' })}`}
                        </div>
                        <div
                            key={transaction.id}
                            type="button"
                            onClick={() => navigate(`/accounts/deposits/transaction/${transaction.transaction_id}`)}
                        >
                            <div>
                                <span>{transaction.name}</span>
                                <span>{date.toLocaleString('default', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div>
                                <DollarCents
                                    value={String(transaction.amount * 100)}
                                    isDebit={transaction.amount < 0}
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
            <Outlet />
        </>
    )
}

export default Deposits
