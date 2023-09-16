import React, { useEffect, useState } from 'react'

import './styles/Authenticator.css'
import {
    LoadingRingDiv,
    NodeImage,
    GrnTextButton,
    CopyButton
} from '@ledget/shared-ui'


const CodeScane = ({ flow, loading }) => {
    const [qrNode, setQrNode] = useState(null)
    const [totpSecret, setTotpSecret] = useState('')
    const [codeMode, setCodeMode] = useState(false)
    useEffect(() => {
        if (flow) {
            const node = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'img')
            setQrNode(node)
            const totpSecret = flow.ui.nodes.find(node => node.group === 'totp' && node.type === 'text')
            setTotpSecret(totpSecret?.attributes.text.context.secret)
        }
    }, [loading])

    return (
        <>
            <div
                className="spaced-header2"
                style={{ opacity: .8 }}
            >
                {!codeMode &&
                    <>
                        <span>
                            Scan the QR code below with your authenticator app
                        </span>
                        <span>
                            e.g. Google Authenticator, Authy, etc.
                        </span>
                    </>
                }
            </div>
            <LoadingRingDiv loading={loading} color='dark'>
                {codeMode
                    ?
                    <>
                        <span>Enter this code in your app</span>
                        <div id="totp-code--container">
                            <span>{totpSecret}</span>
                            <CopyButton onClick={() => navigator.clipboard.writeText(totpSecret)} />
                        </div>
                    </>
                    :
                    <>
                        <div id="qr-code--container">
                            {qrNode && <NodeImage node={qrNode} attributes={qrNode.attributes} />}
                        </div>
                        <GrnTextButton
                            style={{ marginTop: '12px' }}
                            onClick={() => setCodeMode(true)}
                        >
                            Can't scan it?
                        </GrnTextButton>
                    </>
                }
            </LoadingRingDiv>
        </>
    )
}

const AuthenticatorSetup = (props) => {
    const { flow, loadingFlow } = props

    return (
        <div id="code-scane--container">
            <CodeScane
                flow={flow}
                loading={loadingFlow}
            />
        </div>
    )
}

export default AuthenticatorSetup


// <div id="recovery-codes-button--container">
// <span>Recovery Codes:</span>
// <div>
//     <GrnSlimButton className="recovery-codes-button">
//         Download
//         <DownloadIcon stroke={'var(--green-dark3)'} />
//     </GrnSlimButton>
//     <GrnSlimButton className="recovery-codes-button">
//         Copy
//         <CopyIcon fill={'var(--green-dark3)'} />
//     </GrnSlimButton>
// </div>
// </div>
