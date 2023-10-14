import { useState, useEffect } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import './styles/TransactionItem.css'
import { LocationIcon } from '@ledget/assets'
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Image, DollarCents } from '@ledget/ui'


const TransactionModal = withModal((props) => {
    const [item, setItem] = useState(null)
    const [institution, setInstitution] = useState(null)
    const [account, setAccount] = useState([])
    const { data: transactionsData, isSuccess: transactionsFetched } = useGetTransactionsQuery('depository')
    const { data: accountsData, isSuccess: accountsFetched, isLoading } = useGetAccountsQuery()
    const { id } = useParams()

    useEffect(() => {
        transactionsFetched &&
            setItem(transactionsData.find(item => item.transaction_id === id))
    }, [transactionsFetched])

    useEffect(() => {
        if (accountsFetched && item) {
            const account = accountsData.accounts.find(acnt => acnt.account_id === item?.account)
            setInstitution(
                accountsData.institutions.find(inst => inst.id === account?.institution_id)
            )
            setAccount(account)
        }
    }, [accountsFetched, item])

    useEffect(() => {
        console.log('item', item)
    }, [item])

    return (
        <>
            <div className='transaction-info--header'>
                <DollarCents
                    isDebit={item?.amount < 0}
                    value={String(item?.amount * 100)}
                    style={{ textAlign: 'center' }}
                />
                <div>{item?.name}</div>
            </div>
            <div className='transaction-info--container'>
                <div className='inner-window'>
                    <div >
                        <Base64Image
                            data={institution?.logo}
                            alt={institution?.name.charAt(0).toUpperCase()}
                        />
                        <a
                            style={{ color: institution?.primary_color }}
                            href={institution?.url} target="_blank" rel="noreferrer"
                        >
                            {institution?.name}
                        </a>
                    </div>
                    <div>
                        <span>{account?.official_name}</span>
                        <span style={{ opacity: .7 }}>&nbsp;&bull;&nbsp;&bull;&nbsp;{account?.mask}</span>
                    </div>
                </div>
                <div className='inner-window'>
                    <div>
                        {(item?.address || item?.city || item?.region) &&
                            <>
                                <div>Location </div>
                                <div>
                                    <LocationIcon />
                                    <span>{item?.address}</span>
                                    <span>{`${item?.city}${item?.region ? ', ' + item.region : ''}`}</span>
                                </div>
                            </>
                        }
                        {item?.merchant_name &&
                            <>
                                <div>Merchant</div>
                                <div>{item?.merchant_name}</div>
                            </>
                        }
                        <div>Date </div>
                        <div>{new Date(item?.datetime).toLocaleDateString('en-US')}</div>
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
