import React from 'react'

import { useSearchParams } from 'react-router-dom'

import { withModal } from '@ledget/shared-utils'
import './PassKey.css'
import { PasskeyIcon } from "@ledget/shared-assets"

const Modal = withModal((props) => {
    return (
        <div id='passkey-modal-content'>
            <div>
                <PasskeyIcon fill={'var(--m-green)'} />
            </div>
            <h2>Say goodby to passwords</h2>
            <div id="passkey-modal-text">
                <p>
                    Passkeys are a new way to sign in to applications without having to remember a password.
                </p>
                <h3>
                    How does it work?
                </h3>
                <p>
                    Just select the passkey sign in option, follow the prompts, and a secure key will be stored
                    on your device for sign in.
                </p>
                <h3>What if I sign in on a different device?</h3>
                <p>
                    Passkeys are automatically synced across apple and google accounts, but if you want to
                    sign in on a device that doesn't have a passkey, you can scan a qr code from your phone
                    to create a new key on that device and register it.
                </p>
                <h3>Is it safe?</h3>
                <p>Passkeys are even safer than passwords, and make it easier for you to use
                    your apps while worrying about attackers less. A win win!
                </p>
            </div>
        </div>
    )
})

const InfoModal = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const handleCleanup = () => {
        let updatedSearchParams = new URLSearchParams(searchParams.toString())
        updatedSearchParams.delete('help')
        setSearchParams(updatedSearchParams.toString())
    }

    return (
        <Modal
            // remove help from seaerch params
            cleanUp={handleCleanup}
            blur={1}
        />
    )
}

export default InfoModal
