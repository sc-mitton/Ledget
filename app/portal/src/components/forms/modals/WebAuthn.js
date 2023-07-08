import React from 'react'

import withModal from '../utils/withModal'
import './WebAuthn.css'
import webAuthn from "../../../assets/icons/webAuthn.svg"

function Content() {
    return (
        <div
            className='webauthn-modal-content'
        >
            <div>
                <img src={webAuthn} id="webauthn-icon" alt='webauthn icon' />
            </div>
            <h1>Say goodby to passwords</h1>
            <p>Sign in instead with biometrics, a magic email link, or a QR code scan.</p>
        </div>
    )
}

const WebAuthnModal = withModal(Content)

export default WebAuthnModal
