import React, { useEffect, useState, useContext, Fragment } from 'react'

import { Plus, Edit } from '@ledget/media'
import { useSpring, animated } from '@react-spring/web'
import { useSearchParams } from 'react-router-dom'

import './styles/Connections.scss'
import {
    useGetPlaidItemsQuery,
    useDeletePlaidItemMutation,
} from '@features/plaidSlice'
import { useBakedPlaidLink, useBakedUpdatePlaidLink } from '@utils/hooks'
import { withSmallModal } from '@ledget/ui'
import SubmitForm from '@components/pieces/SubmitForm'
import { RelinkIcon } from '@ledget/media'
import { ShadowedContainer } from '@components/pieces'
import {
    SecondaryButton,
    BlueSubmitButton,
    IconButton,
    ShimmerDiv,
    DeleteButton,
    BlackSubmitButton,
    Tooltip,
    Base64Logo
} from '@ledget/ui'
import { withReAuth } from '@utils'

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
                style={{ bottom: '-50%' }}
                type={'left'}
            >
                <DeleteButton
                    className={deleteClass}
                    aria-label="Remove account"
                    onClick={() => onClick()}
                    disabled={!editing}
                    fill={'var(--m-text)'}
                />
            </Tooltip>
        </div >
    )
}

const ReconnectButton = ({ itemId }) => {
    const { open, fetchingToken } = useBakedUpdatePlaidLink()

    return (
        <div className={`reconnect--container ${fetchingToken ? '' : 'wiggle'}`}>
            <BlackSubmitButton
                onClick={() => !fetchingToken && open()}
                aria-label="Reconnect"
            >
                <RelinkIcon fill={'var(--window)'} />
                Reconnect
            </BlackSubmitButton>
        </div>
    )
}

const PlaidItem = ({ item }) => {
    const { deleteQue, setDeleteQue } = useContext(DeleteContext)
    const [removed, setRemoved] = useState(false)

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
            {(item.login_required || item.permission_revoked) &&
                <ReconnectButton itemId={item.id} />
            }
            <div className="header2">
                <div>
                    <Base64Logo
                        data={item.institution.logo}
                        alt={item.institution.name}
                        style={{ marginRight: '.75em' }}
                    />
                    <h4>{item.institution.name}</h4>
                </div>
                <div>
                    <DeleteAllButton onClick={handleRemoveAll} />
                </div>
            </div >
            <div className="account-headers">
                <div>Acct. Name</div>
                <div>Type</div>
                <div>Acct. Num.</div>
            </div>
            <div className="accounts">
                {item.accounts.map((account) => (
                    <Fragment key={account.name}>
                        <div>
                            {account.name}
                        </div >
                        <div>
                            {`${account.subtype} ${account.type === 'loan' ? 'loan' : ''}`}
                        </div>
                        <div>
                            &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                            {account.mask}
                        </div>
                    </Fragment>
                ))}
            </div>
        </animated.div >
    )
}

const ConfirmModal = withReAuth(withSmallModal((props) => {
    const { deleteQue } = useContext(DeleteContext)
    const [deletePlaidItem, { isLoading, isSuccess }] = useDeletePlaidItemMutation()
    const [, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams({ confirm: 'delete' })
        return () => setSearchParams({})
    }, [deleteQue])

    const finalSubmit = () => {
        for (const que of deleteQue) {
            deletePlaidItem({ itemId: que.itemId })
        }
    }

    useEffect(() => {
        let timeout
        if (isSuccess) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isSuccess])

    return (
        <div>
            <h2>Are you sure?</h2>
            <p>
                This will remove the connection to your bank account
                and all of the data associated with this bank. <strong>This action
                    cannot be undone.</strong>
            </p>
            <div id="confirm-modal-bottom-btns">
                <SecondaryButton
                    onClick={() => { props.closeModal() }}
                    aria-label="Cancel"
                >
                    Cancel
                </SecondaryButton>
                <BlueSubmitButton
                    onClick={finalSubmit}
                    submitting={isLoading}
                    success={isSuccess}
                    aria-label="Confirm"
                >
                    Confirm
                </BlueSubmitButton>
            </div>
        </div>
    )
}))

const EmptyState = () => (
    <div id="no-connections-message">
        <h2>No Connections</h2>
        <span>Click the plus icon to get started </span>
        <br />
        <span>connecting your accounts</span>
    </div>
)

const MainHeader = ({ onPlus }) => {
    const { editing, setEditing, plaidItems } = useContext(DeleteContext)

    return (
        <div className="header">
            <h2>Connections</h2>
            <div className='header-btns'>
                {!editing && plaidItems?.length > 0 &&
                    <IconButton
                        onClick={() => setEditing(!editing)}
                        aria-label="Edit institution connections"
                    >
                        <Edit />
                    </IconButton>}
                {plaidItems?.length === 0
                    ? <button className="pulse" onClick={onPlus}><Plus /></button>
                    : <IconButton onClick={onPlus} aria-label="Add institution connection">
                        <Plus />
                    </IconButton>
                }
            </div>
        </div>
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
    const { open, exit, ready } = useBakedPlaidLink()

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

    const Inputs = () => (
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

    return (
        <>
            {showConfirmModal &&
                <ConfirmModal
                    blur={2}
                    onClose={() => {
                        setShowConfirmModal(false)
                        setEditing(false)
                        setDeleteQue([])
                    }}
                />
            }
            <ShimmerDiv shimmering={fetchingPlaidItems}>
                <div id="connections-page" className="padded-content">
                    <MainHeader onPlus={() => open()} />
                    {plaidItems?.length === 0
                        ?
                        <EmptyState />
                        :
                        <>
                            <ShadowedContainer id="accounts-list">
                                <div>
                                    {plaidItems?.map((item) => (
                                        <PlaidItem key={item.id} item={item} />
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
