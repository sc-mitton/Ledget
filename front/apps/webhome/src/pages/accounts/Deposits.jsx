import { useState, useEffect, Fragment } from 'react'

import { useGetAccountsQuery } from "@features/accountsSlice"
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { Base64Logo, DollarCents } from '@components/pieces'

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
                            className={`account-wafer ${account.account_id === currentAccount?.account_id ? 'active' : ''}`}
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

    return (
        <div className="transactions-window">
            <div className="transactions-rows">
                <div>Name</div>
                <div>Date</div>
                <div>Amount</div>
                {transactionsData.filter(transaction => transaction.account === currentAccount).map(transaction => (
                    <Fragment key={transaction.id}>
                        <div>{transaction.name}</div>
                        <div>{transaction.date}</div>
                        <DollarCents
                            value={String(transaction.amount * 100)}
                            style={{ textAlign: 'start' }}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

const Deposits = () => {
    const [currentAccount, setCurrentAccount] = useState(null)

    return (
        <>
            <Wafers
                setCurrentAccount={setCurrentAccount}
                currentAccount={currentAccount}
            />
            <Transactions currentAccount={currentAccount} />
        </>
    )
}

export default Deposits
