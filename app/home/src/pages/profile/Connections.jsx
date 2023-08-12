import React, { useEffect, useState } from 'react'

import Plus from '@assets/icons/Plus'
import {
    usePlaidLink,
} from 'react-plaid-link'
import {
    useGetPlaidTokenQuery,
    useAddNewPlaidItemMutation,
    useGetMeQuery,
} from '@api/apiSlice'

const Connections = () => {
    const { data: user } = useGetMeQuery()
    const { data: results, refetch: getPlaidToken } = useGetPlaidTokenQuery()
    const [addNewPlaidItem] = useAddNewPlaidItemMutation()

    const isOauth = false
    const config = {
        onSuccess: (public_token, metadata) => {
            addNewPlaidItem({
                userId: user?.id,
                data: {
                    public_token: public_token,
                    accounts: metadata.accounts,
                }
            })
        },
        onExit: (err, metadata) => { },
        onEvent: (eventName, metadata) => { },
        token: results?.link_token,
        ...(isOauth ? { receivedRedirectUri: window.location.href } : {}),
    }
    if (import.meta.env.VITE_PLAID_REDIRECT_URI) {
        config.redirect_uri = import.meta.env.VITE_PLAID_REDIRECT_URI
    }
    const { open, exit, ready } = usePlaidLink(config);

    // 30 min timeout to refresh token
    useEffect(() => {
        const timeout = setTimeout(() => {
            getPlaidToken()
        }, 30 * 60 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    const handleClick = () => { open() }

    return (
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
    )
}

export default Connections
