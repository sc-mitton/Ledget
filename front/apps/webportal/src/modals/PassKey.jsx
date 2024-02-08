

import { useSearchParams } from 'react-router-dom'
import { Key } from '@geist-ui/icons'

import { withModal } from '@ledget/ui'
import './PassKey.css'

const Modal = withModal((props) => {
    return (
        <div id='passkey-modal-content'>
            <h2>Say goodby to passwords</h2>
            <Key stroke={'var(--blue-medium)'} size={'2em'} />
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
                    Passkeys are automatically synced across apple and google accounts, you can also
                    scan a QR code from your phone to register a device.
                </p>
                <h3>Is it safe?</h3>
                <p>Passkeys are even safer than passwords, and make it easier for you to use
                    your apps, a win win!
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
            onClose={handleCleanup}
            blur={1}
        />
    )
}

export default InfoModal
