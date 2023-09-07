import React, { useEffect, useState, useContext } from 'react'

import { Plus, Edit, Delete } from '@ledget/shared-assets'
import { useSpring, animated } from '@react-spring/web'
import { useSearchParams } from 'react-router-dom'

import './styles/Connections.css'
import { Desert } from '@components/pieces'
import {
    useGetPlaidItemsQuery,
    useDeletePlaidItemMutation,
} from '@features/plaidSlice'
import {
    Base64Logo,
    ShadowedContainer
} from '@components/pieces'
import { usePlaidLink } from '@utils/hooks'
import { withSmallModal } from '@ledget/shared-utils'
import SubmitForm from '@components/pieces/SubmitForm'
import { Tooltip } from '@components/pieces'
import { SecondaryButton, GrnPrimaryButton, IconButton, ShimmerDiv } from '@ledget/shared-ui'

const DeleteContext = React.createContext()

const ConnectionsContext = ({ children }) => {
    const [deleteQue, setDeleteQue] = useState([])
    const { data: plaidItems, isLoading: fetchingPlaidItems } = useGetPlaidItemsQuery()
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        setEditing(false)
        setDeleteQue([])
    }, [plaidItems])

    const value = {
        deleteQue,
        setDeleteQue,
        plaidItems,
        fetchingPlaidItems,
        editing,
        setEditing,
    }

    return (
        <DeleteContext.Provider value={value}>
            {children}
        </DeleteContext.Provider>
    )
}

const DeleteAllButton = ({ onClick }) => {
    const [loaded, setLoaded] = useState(false)
    const [deleteClass, setDeleteClass] = useState('')
    const { editing } = useContext(DeleteContext)

    useEffect(() => {
        if (!loaded) {
            setLoaded(true)
        } else if (loaded && editing) {
            setDeleteClass('show')
        } else if (!editing) {
            setDeleteClass('remove')
        }
    }, [editing])

    return (
        <div>
            <Tooltip
                id='delete-all-tooltip'
                msg={'Remove account'}
                ariaLabel={'Remove Account'}
                style={{
                    left: '-320%',
                    bottom: '-20%',
                }}
                type={'left'}
            >
                <button
                    className={`btn delete-button ${deleteClass}`}
                    aria-label="Remove account"
                    onClick={() => onClick()}
                    disabled={!editing}
                >
                    <Delete width={'1.3em'} height={'1.3em'} />
                </button>
            </Tooltip>
        </div >
    )
}

const Account = ({ account }) => {
    return (
        <div className={'account-name'} >
            <div>
                <span>
                    {account.name}
                </span>
            </div >
            <div>
                <span>
                    {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                    &nbsp;&nbsp;
                    &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                    {account.mask}
                </span>
            </div>
        </div>
    )
}

const PlaidItem = ({ item }) => {
    const { deleteQue, setDeleteQue } = useContext(DeleteContext)
    const [removed, setRemoved] = useState(false)
    const mid = item.accounts.length / 2 + 1

    const handleRemoveAll = () => {
        // Filter out accounts from delete que
        const filtered = deleteQue.filter((que) => que.itemId !== item.id)
        setDeleteQue([...filtered, { itemId: item.id }])
    }

    useEffect(() => {
        // If the plaid item is in the delete que, set the removed class so
        // the header can be hidden
        if (deleteQue.some((que) => que.itemId === item.id && !que.accountId)) {
            setRemoved(true)
        } else {
            setRemoved(false)
        }

        // If all accounts for the item are in the delete que, swap it out
        // for the plaid item
        if (item.accounts.every((account) =>
            deleteQue.some((que) => que.accountId === account.id)
        )) {
            const filtered = deleteQue.filter((que) => que.itemId !== item.id)
            setDeleteQue([...filtered, { itemId: item.id }])
        }
    }, [deleteQue])


    const springProps = useSpring({
        opacity: removed ? 0 : 1,
        maxHeight: removed ? 0 : 1000,
        config: {
            tension: removed ? 200 : 200,
            friction: removed ? 30 : 100,
        },
    })

    return (
        <animated.div className="institution" style={springProps}>
            <div className="header2">
                <div>
                    <Base64Logo
                        data={item.institution.logo}
                        alt={item.institution.name}
                        backgroundColor={item.institution.primary_color}
                        style={{
                            marginRight: '12px'
                        }}
                    />
                    <h4>{item.institution.name}</h4>
                </div>
                <div>
                    <DeleteAllButton onClick={handleRemoveAll} />
                </div>
            </div >
            <div id="accounts">
                <div>
                    {item.accounts.slice(0, mid).map((account) => (
                        <Account
                            key={account.id}
                            account={{ ...account, itemId: item.id }}
                        />
                    ))}
                </div>
                <div>
                    {item.accounts.slice(mid, item.accounts.length).map((account) => (
                        <Account
                            key={account.id}
                            account={{ ...account, itemId: item.id }}
                        />
                    ))}
                </div>
            </div>
        </animated.div >
    )
}

const Header = ({ onPlus }) => {
    const { editing, setEditing, plaidItems } = useContext(DeleteContext)

    return (
        <div className="header">
            <h1>Connections</h1>
            <div className='header-btns'>
                {!editing && plaidItems.length > 0 &&
                    <IconButton
                        onClick={() => setEditing(!editing)}
                        aria-label="Edit institution connections"
                    >
                        <Edit />
                    </IconButton>}
                {plaidItems.length === 0
                    ? <button className="pulse" onClick={onPlus}><Plus /></button>
                    : <IconButton onClick={onPlus} aria-label="Add institution connection">
                        <Plus />
                    </IconButton>
                }
            </div>
        </div>
    )
}

const Inputs = () => {
    const { deleteQue } = useContext(DeleteContext)

    return (
        deleteQue.map((val, index) => (
            <input
                key={index}
                type="hidden"
                name={val.accountId
                    ? `accounts[${index}][id]`
                    : `items[${index}][id]`}
                value={
                    val.accountId ? val.accountId : val.itemId
                }
            />
        ))
    )
}

const ConfirmModal = withSmallModal((props) => {
    const { deleteQue, setDeleteQue, setEditing } = useContext(DeleteContext)
    const [deletePlaidItem] = useDeletePlaidItemMutation()
    const [, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams({ confirm: 'delete' })
        return () => setSearchParams({})
    }, [deleteQue])

    const finalSubmit = () => {
        for (const que of deleteQue) {
            deletePlaidItem({ plaidItemId: que.itemId })
        }
        setEditing(false)
        props.setVisible(false)
    }

    return (
        <div>
            <h2>Are you sure?</h2>
            <p>
                This will remove the connection to your bank account
                and all of the data associated with this bank. <strong>This action
                    cannot be undone.</strong>
            </p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: '24px',
                }}
            >
                <SecondaryButton
                    onClick={() => {
                        props.setVisible(false)
                        setDeleteQue([])
                        setEditing(false)
                    }}
                    aria-label="Cancel"
                >
                    Cancel
                </SecondaryButton>
                <GrnPrimaryButton
                    onClick={finalSubmit}
                    aria-label="Confirm"
                >
                    Confirm
                </GrnPrimaryButton>
            </div>
        </div>
    )
})

const EmptyState = ({ visible }) => {
    return (
        <Desert>
            <div id="no-connections-message">
                <h2>No Connections</h2>
                <span>Click the plus icon to get started </span>
                <br />
                <span>connecting your accounts</span>
            </div>
        </Desert >
    )
}

const Connections = () => {
    const {
        plaidItems,
        fetchingPlaidItems,
        editing,
        setEditing,
        deleteQue,
        setDeleteQue,
    } = useContext(DeleteContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const { open, exit, ready } = usePlaidLink()

    // if (import.meta.env.VITE_PLAID_REDIRECT_URI) {
    //     config.receivedRedirectUri = import.meta.env.VITE_PLAID_REDIRECT_URI
    // }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (deleteQue.length > 0) {
            setShowConfirmModal(true)
        } else {
            setEditing(false)
        }
    }

    return (
        <>
            {showConfirmModal &&
                <ConfirmModal
                    blur={2}
                    cleanUp={() => { setShowConfirmModal(false) }}
                />
            }
            <ShimmerDiv shimmering={fetchingPlaidItems}>
                <div id="connections-page" className="padded-content">
                    <Header onPlus={() => open()} />
                    {plaidItems?.length === 0
                        ?
                        <EmptyState />
                        :
                        <>
                            <ShadowedContainer id="accounts-list">
                                <div onResize={(e) => console.log(e)}>
                                    {plaidItems?.map((item) => (
                                        <PlaidItem
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </ShadowedContainer>
                            <div className="footer-container">
                                {editing &&
                                    <form onSubmit={handleFormSubmit}>
                                        <Inputs />
                                        <SubmitForm
                                            onCancel={() => {
                                                setDeleteQue([])
                                                setEditing(false)
                                            }}
                                        />
                                    </form>}
                            </div>
                        </>
                    }
                </div>
            </ShimmerDiv>
        </>
    )
}

const ConnectionsComponent = () => (
    <ConnectionsContext>
        <Connections />
    </ConnectionsContext>
)

export default ConnectionsComponent
