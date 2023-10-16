import { useState, useEffect } from 'react'

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Big from 'big.js'

import './styles/TransactionItem.css'
import { LocationIcon } from '@ledget/media'
import { useGetTransactionsQuery } from '@features/transactionsSlice'
import { useGetAccountsQuery } from "@features/accountsSlice"
import { withModal, Base64Image, DollarCents } from '@ledget/ui'


const TransactionModal = withModal((props) => {
    const { id } = useParams()
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
            setItem(transactionsData.results.find(item => item.transaction_id === id))
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
                <DollarCents
                    value={item?.amount && new Big(item.amount).times(100).toNumber()}
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
                        {item?.merchant_name &&
                            <>
                                <div className="merchant-cell">{item?.merchant_name}</div>
                            </>
                        }
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
