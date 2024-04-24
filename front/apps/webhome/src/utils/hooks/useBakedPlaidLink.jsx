import { useEffect, useState } from 'react'

import { usePlaidLink as useLink } from 'react-plaid-link'

import { useGetPlaidTokenQuery, useAddNewPlaidItemMutation, useUpdatePlaidItemMutation } from '@features/plaidSlice'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'

export function useBakedPlaidLink(onBoarding) {
    const [isOauthRedirect, setIsOauthRedirect] = useState(false)
    const { data: fetchedToken, refech: refetchToken } = useGetPlaidTokenQuery({ isOnboarding: onBoarding })

    const [addNewPlaidItem, { data: newPlaidItem, isSuccess: newItemAddSuccess }] = useAddNewPlaidItemMutation()
    const [syncTransactions] = useTransactionsSyncMutation()

    useEffect(() => {
        let timeout = setTimeout(() => {
            refetchToken()
        }, 1000 * 60 * 60 * 30) // 30 minutes
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (window.location.href.includes('oauth_state_id')) {
            setIsOauthRedirect(true)
        }
    }, [])

    useEffect(() => {
        newItemAddSuccess && syncTransactions({ item: newPlaidItem?.id })
    }, [newItemAddSuccess])

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
        token: fetchedToken?.link_token,
        ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {})
    }

    const { open, exit, ready } = useLink(config)

    return { open, exit, ready }
}

export const useBakedUpdatePlaidLink = ({ itemId }) => {
    const { data: plaidToken, isLoading: fetchingToken, refech: refetchToken } = useGetPlaidTokenQuery({ itemId: itemId })
    const [updatePlaidItem] = useUpdatePlaidItemMutation()
    const [isOauthRedirect, setIsOauthRedirect] = useState(false)

    useEffect(() => {
        let timeout = setTimeout(() => {
            refetchToken()
        }, 1000 * 60 * 30)
        return () => clearTimeout(timeout)
    }, [])

    const config = {
        onSuccess: (public_token, metadata) => {
            updatePlaidItem({
                itemId: itemId,
                data: {
                    login_required: false,
                    permission_revoked: false
                }
            })
        },
        onExit: (err, metadata) => { },
        onEvent: (eventName, metadata) => { },
        token: plaidToken?.link_token,
        ...(isOauthRedirect ? { receivedRedirectUri: window.location.href } : {})
    }
    const { open, ready, exit } = useLink(config)

    useEffect(() => {
        if (window.location.href.includes('oauth_state_id')) {
            setIsOauthRedirect(true)
        }
    }, [])

    return { open, ready, exit, fetchingToken }
}
