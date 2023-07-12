import React, { useState } from 'react'

import PasskeyIcon from "../../../assets/icons/PasskeyIcon"
import HelpIcon from "../../../assets/icons/HelpIcon"
import PasskeyModal from "../modals/PassKey"
import './styles/PasswordlessFormSection.css'

const PasswordlessFormSection = ({ helpIcon = true }) => {
    const [passKeyModalVisible, setPassKeyModalVisible] = useState(false)

    return (
        <>
            <PasskeyModal visible={passKeyModalVisible} setVisible={setPassKeyModalVisible} />
            <div className="passwordless-form-section-container">
                <div className="passwordless-option-header" >
                    <div>
                        or
                    </div>
                </div>
                <div className='passwordless-button-container'>
                    <button
                        className='passwordless-button'
                        name="passwordless-options"
                        type="submit"
                    >
                        <PasskeyIcon />
                        Passkey
                    </button>
                    {helpIcon &&
                        <button
                            className="help-icon-tip"
                            onClick={() => setPassKeyModalVisible(true)}
                            aria-label="Learn more about authentication with passkeys"
                        >
                            <HelpIcon />
                        </button >
                    }
                </div>
            </div>
        </>
    )
}

export default PasswordlessFormSection
