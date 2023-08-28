import React, { useEffect } from 'react'
import { usePlaidLink as useLink, } from 'react-plaid-link'
import {
    useGetPlaidTokenQuery,
    useAddNewPlaidItemMutation,
} from '@features/plaidSlice'


function usePlaidLink() {
    const [addNewPlaidItem] = useAddNewPlaidItemMutation()
    const { data: plaidToken, refetch: refetchPlaidToken } = useGetPlaidTokenQuery()

    const isOauth = false

    // 30 min timeout to refresh token
    useEffect(() => {
        const timeout = setTimeout(() => {
            refetchPlaidToken()
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
        onExit: (err, metadata) => {
        },
        onEvent: (eventName, metadata) => { },
        token: plaidToken?.link_token,
        // ...(isOauth ? {receivedRedirectUri: window.location.href } : { }),
    }

    const { open, exit, ready } = useLink(config)

    return { open, exit, ready }
}

export default usePlaidLink
