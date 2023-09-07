import React, { useEffect, useState } from 'react'

import { usePlaidLink as useLink, } from 'react-plaid-link'

import {
    useLazyGetPlaidTokenQuery,
    useAddNewPlaidItemMutation
} from '@features/plaidSlice'

function usePlaidLink(onBoarding = false) {
    const [addNewPlaidItem] = useAddNewPlaidItemMutation()
    const [plaidToken, setPlaidToken] = useState(null)
    const [isOauthRedirect, setIsOauthRedirect] = useState(false)
    const [fetchToken, { data: fetchedToken, isSuccess }] = useLazyGetPlaidTokenQuery()

    useEffect(() => {
        if (window.location.href.includes('oauth_state_id')) {
            setIsOauthRedirect(true)
        }
    }, [])

    useEffect(() => {
        const token = sessionStorage.getItem('plaidToken')
        if (token) {
            setPlaidToken(JSON.parse(token))
        } else {
            console.log('fetching token')
            fetchToken({ isOnboarding: onBoarding })
        }
    }, [])

    useEffect(() => {
        if (isSuccess) {
            setPlaidToken(fetchedToken)
            sessionStorage.setItem('plaidToken', JSON.stringify(fetchedToken))
        }
    }, [isSuccess, plaidToken])

    // 30 min timeout to refresh token
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchToken({ isOnboarding: onBoarding })
        }, 30 * 60 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    const config = {
        onSuccess: (public_token, metadata) => {
            const institution = {
                id: metadata.institution.institution_id,
                name: metadata.institution.name
            }
            addNewPlaidItem({
                data: {
                    public_token: public_token,
                    accounts: metadata.accounts,
                    institution: institution,
                },
            })
        },
        onExit: (err, metadata) => { },
        onEvent: (eventName, metadata) => { },
        token: plaidToken?.link_token,
        ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {})
    }

    const { open, exit, ready } = useLink(config)

    return { open, exit, ready }
}

export default usePlaidLink
