import React, { useEffect } from 'react'
import withModal from '../utils/withModal'
import { useState } from 'react'

import Plus from '../../assets/svg/Plus'
import Edit from '../../assets/svg/Edit'
import FinicityConnect from './FinicityConnect'


function AccountContent(props) {
    const [hasUpdates, setHasUpdates] = useState(false)
    const [editConnectedInstitutions, setEditConnectedInstitutions] = useState(false)
    const [finicityConnect, setFinicityConnect] = useState(false)

    const handleSave = () => {
        // TODO: Save changes to database
        setEdit(false)
        props.setVisible(false)
    }

    const Info = () => {
        return (
            <div className='sub-header'>
                <h3>Personal Info</h3>
                <div className='sub-header-buttons'>
                    <button className='icon modal-icon' id='edit-icon'>
                        <Edit />
                    </button>
                </div>
            </div>
        )
    }

    const Plan = () => {
        return (
            <div className='sub-header'>
                <h3>Plan</h3>
            </div>
        )
    }

    useEffect(() => {
        if (finicityConnect) {
            props.setHideModal(true)
        } else {
            props.setHideModal(false)
        }
    }, [finicityConnect])

    const Institutions = () => {
        return (
            <div className='sub-header'>
                <h3>Connected Institutions</h3>
                <div className='sub-header-buttons'>
                    <>
                        <button
                            className='icon modal-icon'
                            id='edit-icon'
                            onClick={() => setEditConnectedInstitutions(true)}
                            aria-label="Edit institutions"
                        >
                            <Edit />
                        </button>
                        <button
                            className='icon modal-icon'
                            id='add-icon'
                            onClick={() => setFinicityConnect(true)}
                            aria-label="Add institution"
                        >
                            <Plus />
                        </button>
                    </>
                </div>
            </div>
        )
    }

    const SubmitFooter = () => {
        return (
            <div className='modal-footer'>
                <button
                    className="cancel-button"
                    onClick={() => setEdit(false)}
                    aria-label="Cancel changes"
                >
                    Cancel
                </button>
                <button
                    className="submit-button"
                    onClick={handleSave}
                    aria-label="Save changes"
                >
                    Save
                </button>
            </div>
        )
    }

    const DefaultContent = () => {
        return (
            <>
                <h1>Account</h1>
                <Info />
                <Plan />
                <Institutions />
                {hasUpdates && <SubmitFooter />}
            </>
        )
    }

    return (
        <>
            <DefaultContent key="default-content" />
            {finicityConnect && <FinicityConnect
                cleanUp={() => setFinicityConnect(false)}
                background='transparent'
                hasExit={false}
            />}
        </>
    )
}

const Account = withModal(AccountContent)

export default Account
