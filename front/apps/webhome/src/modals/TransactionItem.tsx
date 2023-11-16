import { useState, useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom';
import Big from 'big.js'

import './styles/TransactionItem.scss'
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Logo, DollarCents } from '@ledget/ui'


const TransactionModal = withModal((props) => {
    const location = useLocation()

    const [item, setItem] = useState<any>({})
    const [institution, setInstitution] = useState<any>({})
    const [account, setAccount] = useState<any>({})

    const {
        data: transactionsData,
        isSuccess: transactionsFetched
    } = useGetTransactionsQuery(location.state.getTransactionsParams)
    const { data: accountsData, isSuccess: accountsFetched } = useGetAccountsQuery()

    useEffect(() => {
        transactionsFetched &&
            setItem(transactionsData.results.find(item => item.transaction_id === location.state.transactionId))
    }, [transactionsFetched])

    useEffect(() => {
        if (accountsFetched && item) {
            const account = accountsData.accounts.find((acnt: any) => acnt.account_id === item?.account)
            setInstitution(
                accountsData.institutions.find((inst: any) => inst.id === account?.institution_id)
            )
            setAccount(account)
        }
    }, [accountsFetched, item])

    return (
        <>
            <div className='transaction-info--header'>
                <div style={{ textAlign: 'center' }}>
                    <DollarCents value={item?.amount && new Big(item.amount).times(100).toNumber()} />
                </div>
                <div>{item?.preferred_name || item?.name}</div>
            </div>
            <div className='transaction-info--container'>
                <div className='inner-window'>
                    <div >
                        <a href={institution?.url} target="_blank" rel="noreferrer">
                            <Base64Logo
                                data={institution?.logo}
                                alt={institution?.name?.charAt(0).toUpperCase()}
                            />
                        </a>
                    </div>
                    <div>
                        <span>{account?.official_name}</span>
                        <span style={{ opacity: .7 }}>&nbsp;&bull;&nbsp;&bull;&nbsp;{account?.mask}</span>
                    </div>
                </div>
                <div className='inner-window'>
                    <div>
                        {item?.merchant_name &&
                            <>
                                <div className="merchant-cell">
                                    <h3>{item?.merchant_name}</h3>
                                </div>
                            </>
                        }
                        <div>Date </div>
                        <div>{new Date(item?.datetime).toLocaleDateString('en-US', { 'month': 'short', 'day': 'numeric', 'year': 'numeric' })}</div>
                        {(item?.address || item?.city || item?.region) &&
                            <>
                                <div>Location </div>
                                <div>
                                    <span>{item?.address}</span>
                                    <span>{`${item?.city}${item?.region ? ', ' + item.region : ''}`}</span>
                                </div>
                            </>
                        }

                    </div>
                </div>
            </div>
        </>
    )
})

export default function () {
    const navigate = useNavigate()

    return (
        <TransactionModal onClose={() => navigate(-1)} />
    )
}
