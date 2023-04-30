import React from 'react'
import withModal from './withModal'
import { useState } from 'react'

import Plus from '../../assets/images/Plus'
import Edit from '../../assets/images/Edit'


function AccountContent(props) {
    const [edit, setEdit] = useState(false)

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
                    {edit &&
                        <button className='icon modal-icon' id='edit-icon'>
                            <Edit />
                        </button>
                    }
                </div>
            </div>
        )
    }

    const Plan = () => {
        return (
            <div className='sub-header'>
                <h3>Plan</h3>
                <div className='sub-header-buttons'>
                    {edit &&
                        <button className='icon modal-icon' id='edit-icon'>
                            <Edit />
                        </button>
                    }
                </div>
            </div>
        )
    }

    const Institutions = () => {
        return (
            <div className='sub-header'>
                <h3>Connected Institutions</h3>
                <div className='sub-header-buttons'>
                    {edit &&
                        <>
                            <button className='icon modal-icon' id='edit-icon'>
                                <Edit />
                            </button>
                            <button className='icon modal-icon' id='add-icon'>
                                <Plus />
                            </button>
                        </>
                    }
                </div>
            </div>
        )
    }

    const EditFooter = () => {
        return (
            <div className='modal-footer'>
                <button className="edit-button" onClick={() => setEdit(true)}>Edit</button>
            </div>
        )
    }

    const SubmitFooter = () => {
        return (
            <div className='modal-footer'>
                <button className="cancel-button" onClick={() => setEdit(false)}>Cancel</button>
                <button className="submit-button" onClick={handleSave}>Save</button>
            </div>
        )
    }

    return (
        <>
            <div>
                <h1>Account</h1>
                <Info />
                <Plan />
                <Institutions />
                {edit ? <SubmitFooter /> : <EditFooter />}
            </div>
        </>
    )
}

const Account = withModal(AccountContent)

export default Account
