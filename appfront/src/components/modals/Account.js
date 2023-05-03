import React from 'react'
import withModal from './withModal'
import { useState } from 'react'

import Plus from '../../assets/images/Plus'
import Edit from '../../assets/images/Edit'

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

    const handleAddInstitution = () => {
    }

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
                            onClick={() => handleAddInstitution()}
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

    const FinicityConnect = () => {
        return (

            <div className="modal-footer">
                <button
                    className="cancel-button"
                    onClick={() => setFinicityConnect(false)}
                >
                    cancel
                </button>
            </div>
        )
    }

    return (
        <>
            <DefaultContent key="default-content" />
        </>
    )
}

const Account = withModal(AccountContent)

export default Account
