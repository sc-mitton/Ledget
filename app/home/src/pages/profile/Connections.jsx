import React, { useEffect, useState } from 'react'

import Plus from '@assets/icons/Plus'
import Edit from '@assets/icons/Edit'
import { usePlaidLink } from 'react-plaid-link'

import './styles/Connections.css'
import Delete from '@assets/icons/Delete'
import {
    useGetPlaidTokenQuery,
    useAddNewPlaidItemMutation,
    useGetMeQuery,
    useGetPlaidItemsQuery,
    useDeletePlaidItemMutation,
} from '@api/apiSlice'
import {
    LoadingShimmer,
    Base64Logo,
    ShadowedContainer
} from '@components/pieces'
import SubmitForm from '@components/modals/pieces/SubmitForm'


const PlaidItem = ({ item, edit }) => {

    const DeleteButton = () => (
        <div>
            <button
                className="btn delete-button"
                aria-label="Change plan"
                onClick={() => { console.log('change plan') }}
            >
                <Delete />
            </button>
        </div >
    )

    return (
        <div className="institution">
            <div className="header2">
                <div>
                    <Base64Logo
                        data={item.institution.logo}
                        alt={item.institution.name}
                        color={item.institution.primary_color}
                        style={{ marginRight: '12px' }}
                    />
                    <h4>{item.institution.name}</h4>
                </div>
                {edit ? <DeleteButton /> : <div />}
            </div >
            <div> {
                item.accounts.map((account) => (
                    <div key={account.id} className="account body">
                        <div className="account-name">
                            <span>{account.name}</span>
                            <span>
                                &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                                {account.mask}
                            </span>
                        </div>
                    </div>
                ))
            } </div>
        </div >
    )
}

const Header = ({ edit, setEdit, onPlus }) => (
    <div className="header">
        <h1>Connections</h1>
        <div className='header-btns'>
            {!edit &&
                <button
                    className="btn-clr btn"
                    onClick={() => setEdit(!edit)}
                    aria-label="Edit institution connections"
                >
                    <Edit />
                </button>}
            <button
                className="btn-clr btn"
                onClick={onPlus}
                aria-label="Add institution connection"
            >
                <Plus />
            </button>
        </div>
    </div>
)

const Connections = () => {
    const [edit, setEdit] = useState(false)
    const [saving, setSaving] = useState(false)
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

    return (
        <>
            <LoadingShimmer visible={fetchingPlaidItems} />
            {!fetchingPlaidItems &&
                <div id="connections-page">
                    <Header
                        edit={edit}
                        setEdit={setEdit}
                        onPlus={() => open()}
                    />
                    <ShadowedContainer id="accounts-list">
                        <div>
                            {plaidItems?.map((item) => (
                                <PlaidItem
                                    edit={edit}
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                    </ShadowedContainer>
                    <div className="footer-container">
                        {edit &&
                            <SubmitForm
                                submitting={saving}
                                onCancel={() => setEdit(false)}
                            />}
                    </div>
                </div>
            }
        </>
    )
}

export default Connections
