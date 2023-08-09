import React, { useEffect, useState } from 'react'

import Plus from '@assets/icons/Plus'
import {
    usePlaidLink,
} from 'react-plaid-link'
import { useGetPlaidTokenQuery } from '@api/apiSlice'
import { ledget } from '@api/ledget'


const Connections = () => {
    const { data: results, refetch: getPlaidToken } = useGetPlaidTokenQuery()
    const [publicToken, setPublicToken] = useState(null)

    const isOauth = false
    const config = {
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token)
            console.log(metadata)
        },
        onExit: (err, metadata) => { },
        onEvent: (eventName, metadata) => { },
        token: results?.link_token,
        ...(isOauth ? { receivedRedirectUri: window.location.href } : {}),
    }
    const { open, exit, ready } = usePlaidLink(config);

    useEffect(() => {
        // 30 min timeout to refresh token
        const timeout = setTimeout(() => {
            getPlaidToken()
        }, 30 * 60 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        if (publicToken) {
            ledget.post('/plaid_token_exchange', { publicToken })
        }
    }, [publicToken])

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
