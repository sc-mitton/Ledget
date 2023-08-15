import React, { useEffect } from 'react'

import Plus from '@assets/icons/Plus'
import Edit from '@assets/icons/Edit'
import { usePlaidLink } from 'react-plaid-link'

import {
    useGetPlaidTokenQuery,
    useAddNewPlaidItemMutation,
    useGetMeQuery,
    useGetPlaidItemsQuery,
} from '@api/apiSlice'
import { LoadingShimmer, Base64Logo, ContainerShadow } from '@components/pieces'
import './styles/Connections.css'


const PlaidItem = ({ item }) => {

    return (
        <div className="institution">
            <div className="header3">
                <Base64Logo
                    data={item.institution.logo}
                    alt={item.institution.name}
                    color={item.institution.primary_color}
                    style={{ marginRight: '12px' }}
                />
                <h4>{item.institution.name}</h4>
            </div>
            {item.accounts.map((account) => (
                <div key={account.id} className="account body">
                    <div className="account-name">
                        <span>{account.name}</span>
                        <span>
                            &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&nbsp;
                            {account.mask}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Connections = () => {
    const { data: user } = useGetMeQuery()
    const { data: plaidItems, isLoading: fetchingPlaidItems } = useGetPlaidItemsQuery(user.id)
    const { data: plaidToken, refetch: refetchPlaidToken } = useGetPlaidTokenQuery()
    const [addNewPlaidItem] = useAddNewPlaidItemMutation()

    const isOauth = false
    const config = {
        onSuccess: (public_token, metadata) => {
            const institution = {
                id: metadata.institution.institution_id,
                name: metadata.institution.name
            }
            addNewPlaidItem({
                userId: user?.id,
                data: {
                    public_token: public_token,
                    accounts: metadata.accounts,
                    institution: institution,
                },
            })
        },
        onExit: (err, metadata) => {
        },
        onEvent: (eventName, metadata) => { },
        token: plaidToken?.link_token,
        ...(isOauth ? { receivedRedirectUri: window.location.href } : {}),
    }
    if (import.meta.env.VITE_PLAID_REDIRECT_URI) {
        config.redirect_uri = import.meta.env.VITE_PLAID_REDIRECT_URI
    }
    const { open, exit, ready } = usePlaidLink(config)

    // 30 min timeout to refresh token
    useEffect(() => {
        const timeout = setTimeout(() => {
            refetchPlaidToken()
        }, 30 * 60 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    const handleClick = () => { open() }

    return (
        <>
            <LoadingShimmer visible={fetchingPlaidItems} />
            {!fetchingPlaidItems &&
                <div id="connections-page">
                    <div>
                        <div className="header">
                            <h1>Connections</h1>
                            <div className='header-btns'>
                                <button
                                    className="btn-clr btn"
                                    onClick={handleClick}
                                    aria-label="Edit institution connections"
                                >
                                    <Edit />
                                </button>
                                <button
                                    className="btn-clr btn"
                                    onClick={handleClick}
                                    aria-label="Add institution connection"
                                >
                                    <Plus />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="accounts-list">
                        <ContainerShadow visible={true} location={'top'} />
                        <ContainerShadow visible={true} location={'bottom'} />
                        <div>
                            {plaidItems?.map((item) => (<PlaidItem key={item.id} item={item} />))}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Connections
