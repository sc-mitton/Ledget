import { useState, useEffect } from 'react'

import { useNavigate, Outlet } from 'react-router-dom'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { Base64Logo, DollarCents } from '@components/pieces'
import { digitMonthToAbrev, formatMDY } from "@ledget/shared-utils"
import { ShimmerDiv } from "@ledget/shared-ui"

const Wafers = ({ setCurrentAccount, currentAccount }) => {
    const { data: accountsData, isSuccess } = useGetAccountsQuery()

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
                            role="button"
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

const Transactions = ({ currentAccount }) => {
    const { data: transactionsData } = useGetTransactionsQuery('depository')
    let previousMonth = null
    const navigate = useNavigate()

    const amountFlexBasis = transactionsData
        .filter(transaction => currentAccount === transaction.account)
        .reduce((acc, transaction) => {
            const amountLength = String(transaction.amount).length
            return amountLength > acc ? amountLength : acc
        }, 0) + 2


    return (
        <div className="transaction-rows">
            <div className="transaction-row">
                <div>Name</div>
                <div style={{ flexBasis: `${amountFlexBasis}ch` }}>
                    Amount
                </div>
            </div>
            {transactionsData.filter(transaction => currentAccount === transaction.account).map((transaction) => {
                const currentMonth = transaction.date.slice(5, 7)
                let newMonth = false
                if (previousMonth !== currentMonth) {
                    previousMonth = currentMonth
                    newMonth = true
                }
                return (
                    <>
                        <div
                            className="transaction-row"
                            key={transaction.id}
                            type="button"
                            onClick={() => navigate(`/accounts/transaction/${transaction.transaction_id}`)}
                        >
                            {newMonth &&
                                <div className="month-delimiter">
                                    {`${digitMonthToAbrev(currentMonth)}`}
                                </div>
                            }
                            <div>
                                <span>{transaction.name}</span>
                                <span>
                                    {formatMDY(transaction.date)}
                                </span>
                            </div>
                            <DollarCents
                                value={String(transaction.amount * 100)}
                                isDebit={transaction.amount < 0}
                                style={{
                                    textAlign: 'start',
                                    flexBasis: `${amountFlexBasis}ch`,
                                }}
                                className={transaction.amount < 0 ? 'debit' : 'credit'}
                            />
                        </div>
                        <hr />
                    </>
                )
            })}
        </div>
    )
}

const Deposits = () => {
    const [currentAccount, setCurrentAccount] = useState('')
    const { isLoading } = useGetTransactionsQuery('depository')

    return (
        <>
            <Wafers
                setCurrentAccount={setCurrentAccount}
                currentAccount={currentAccount}
            />
            <ShimmerDiv shimmering={isLoading} className="transactions-window">
                <Transactions currentAccount={currentAccount} />
            </ShimmerDiv>
            <Outlet />
        </>
    )
}

export default Deposits
