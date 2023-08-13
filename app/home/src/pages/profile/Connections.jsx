import React, { useEffect } from 'react'

import Plus from '@assets/icons/Plus'
import { usePlaidLink } from 'react-plaid-link'

import {
    useGetPlaidTokenQuery,
    useAddNewPlaidItemMutation,
    useGetMeQuery,
    useGetPlaidItemsQuery,
} from '@api/apiSlice'
import { LoadingShimmer } from '@components/pieces'

const PlaidItem = ({ item }) => {

    return (
        <>
        </>
    )
}

const Connections = () => {
    const { data: user } = useGetMeQuery()
    const { isLoading: fetchingPlaidItems } = useGetPlaidItemsQuery(user.id)
    const { data: results, refetch: refetchPlaidToken } = useGetPlaidTokenQuery()
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
        token: results?.link_token,
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
                <div >
                    <div className="header">
                        <h1>Connections</h1>
                        <button
                            className="btn-clr btn"
                            onClick={handleClick}
                            aria-label="Add institution connection"
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default Connections
