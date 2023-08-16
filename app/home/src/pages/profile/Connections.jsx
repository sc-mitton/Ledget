import React, { useEffect, useState, useContext } from 'react'

import Plus from '@assets/icons/Plus'
import Edit from '@assets/icons/Edit'
import { usePlaidLink } from 'react-plaid-link'
import { useSpring, animated } from '@react-spring/web'

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

const DeleteContext = React.createContext()

const ConnectionsContext = ({ children }) => {
    const [deleteQue, setDeleteQue] = useState([])
    const { data: user } = useGetMeQuery()
    const { data: plaidItems, isLoading: fetchingPlaidItems } = useGetPlaidItemsQuery(user.id)

    const value = {
        deleteQue,
        setDeleteQue,
        plaidItems,
        fetchingPlaidItems,
        user
    }
    return (
        <DeleteContext.Provider value={value}>
            {children}
        </DeleteContext.Provider>
    )
}

const DeleteAllButton = ({ show, onClick }) => {
    const [loaded, setLoaded] = useState(false)
    const [lass, setlass] = useState('')
    const { setDeleteQue } = useContext(DeleteContext)

    useEffect(() => {
        setLoaded(true)
        if (loaded && show) {
            setlass('show')
        } else if (loaded) {
            setlass('remove')
        }
    }, [show])

    return (
        <div>
            <button
                className={`btn-red btn-slim delete-all-button ${lass}`}
                aria-label="Remove all accounts from institution"
                onClick={() => onClick()}
                disabled={!show}
            >
                Remove All
            </button>
        </div >
    )
}

const DeleteButton = (props) => {
    const { visible, account, ...rest } = props
    const [hover, setHover] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [deleteClass, setDeleteClass] = useState('')
    const { deleteQue, setDeleteQue } = useContext(DeleteContext)

    const springProps = useSpring({
        transformOrigin: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transform: hover ? 'rotate(45deg)' : 'rotate(0deg)',
    })

    useEffect(() => {
        setLoaded(true)
        if (loaded && visible) {
            setDeleteClass('show')
        } else if (loaded) {
            setDeleteClass('remove')
        }
    }, [visible])

    return (
        <>
            <animated.button
                style={springProps}
                className={`btn delete-button ${deleteClass}`}
                aria-label="Remove account"
                disabled={!visible}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                {...rest}
                onClick={(e) => {
                    e.preventDefault()
                    if (deleteQue.filter((item) => item.account === account.id).length === 0) {
                        setDeleteQue((prev) => [...prev, { account: account.id }])
                    }
                }}
            >
                <span><Delete /></span>
            </animated.button>
        </>
    )
}

const AccountsColumn = ({ item, showDelete, start, end }) => {

    const typeMap = {
        'checking': 'Checking',
        'savings': 'Savings',
        'credit card': 'Credit Card',
        'cd': 'CD',
        'money market': 'Money Market',
        'ira': 'IRA',
        '401k': '401k',
        'student': 'Student Loan',
        'mortgage': 'Mortgage',
    }

    return (
        <div>
            {item.accounts.slice(start, end).map((account) => (
                <div className={'account'}>
                    <div className="account-name">
                        <div>
                            <span>
                                {account.name}
                            </span>
                            <DeleteButton visible={showDelete} account={account} />
                        </div >
                        <div>
                            <span>
                                {typeMap[account.subtype]}
                                &nbsp;&nbsp;
                                &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                                {account.mask}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const PlaidItem = ({ item, edit }) => {
    const { setDeleteQue } = useContext(DeleteContext)

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
                <div>
                    <DeleteAllButton
                        show={edit}
                        onClick={() => setDeleteQue(
                            (prev) => [...prev, { item: item.id }]
                        )}
                    />
                </div>
            </div >
            <div id="accounts">
                <AccountsColumn
                    item={item}
                    start={0}
                    end={item.accounts.length / 2 + 1}
                    showDelete={edit}
                />
                <AccountsColumn
                    item={item}
                    start={item.accounts.length / 2 + 1}
                    end={item.accounts.length}
                    showDelete={edit}
                />
            </div>
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

const Inputs = () => {
    const { deleteQue } = useContext(DeleteContext)

    return (
        deleteQue.map((item, index) => (
            <input
                key={index}
                type="hidden"
                name={item.account
                    ? `accounts[${index}][id]`
                    : `items[${index}][id]`}
                value={
                    item.account ? item.account : item.item
                }
            />
        ))
    )
}

const Connections = () => {
    const [edit, setEdit] = useState(false)
    const [saving, setSaving] = useState(false)
    const {
        plaidItems,
        fetchingPlaidItems,
        user
    } = useContext(DeleteContext)

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
        config.receivedRedirectUri = import.meta.env.VITE_PLAID_REDIRECT_URI
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
                        {edit && <form>
                            <Inputs />
                            <SubmitForm
                                submitting={saving}
                                onCancel={() => setEdit(false)}
                            />
                        </form>}
                    </div>
                </div>
            }
        </>
    )
}

const ConnectionsComponent = () => (
    <ConnectionsContext>
        <Connections />
    </ConnectionsContext>
)

export default ConnectionsComponent
