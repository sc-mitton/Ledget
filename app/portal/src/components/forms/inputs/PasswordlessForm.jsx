import React, { useState, useEffect } from 'react'

import { filterNodesByGroups, isUiNodeInputAttributes } from '@ory/integrations/ui'

import PasskeyIcon from "@assets/icons/PasskeyIcon"
import HelpIcon from "@assets/icons/HelpIcon"
import PasskeyModal from "../modals/PassKey"
import './styles/PasswordlessFormSection.css'


const PasswordlessOptionsHeader = () => {
    return (
        <div className="passwordless-option-header" >
            <div>
                or
            </div>
        </div>
    )
}

const PasswordlessForm = ({ flow = { flow }, helpIcon = true, children }) => {
    const [passKeyModalVisible, setPassKeyModalVisible] = useState(false)

    const handleFocus = (e) => {
        document.addEventListener('keydown', handleEnter)
    }

    const handleBlur = () => {
        document.removeEventListener('keydown', handleEnter)
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            setPassKeyModalVisible(true)
        }
    }

    useEffect(() => {
        const scriptNodes = filterNodesByGroups({
            nodes: flow.ui.nodes,
            groups: "webauthn",
            attributes: "text/javascript",
            withoutDefaultGroup: true,
            withoutDefaultAttributes: true,
        }).map((node) => {
            const attr = node.attributes
            const script = document.createElement("script")
            script.src = attr.src
            script.type = attr.type
            script.async = attr.async
            script.referrerPolicy = attr.referrerpolicy
            script.crossOrigin = attr.crossorigin
            script.integrity = attr.integrity
            document.body.appendChild(script)
            return script
        })

        // cleanup
        return () => {
            scriptNodes.forEach((script) => {
                document.body.removeChild(script)
            })
        }
    }, [flow.ui.nodes])

    const WrappedHelpIcon = () => {
        return (
            <div
                className="help-icon-tip"
                aria-label="Learn more about authentication with passkeys"
                onClick={() => { setPassKeyModalVisible(true) }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex={0}
            >
                <HelpIcon />
            </div >
        )
    }

    const Nodes = () => {

        return (
            <>
                {filterNodesByGroups({
                    nodes: flow.ui.nodes,
                    groups: ["webauthn"],
                    attributes: ['submit', 'button', 'hidden'],
                }).map((node) => {
                    if (isUiNodeInputAttributes(node.attributes)) {
                        const attrs = node.attributes
                        const nodeType = attrs.type
                        const submit = {
                            type: attrs.type,
                            name: attrs.name,
                            ...(attrs.value && { value: attrs.value }),
                        }
                        switch (nodeType) {
                            case "button":
                                if (attrs.onclick) {
                                    // This is a bit hacky but it wouldn't work otherwise.
                                    const oc = attrs.onclick
                                    submit.onClick = () => {
                                        eval(oc)
                                    }
                                }
                                return (
                                    <div className='passwordless-button-container' key={attrs.name}>
                                        <button
                                            className='passwordless-button'
                                            disabled={attrs.disabled}
                                            {...submit}
                                        >
                                            <PasskeyIcon />
                                            Passkey
                                        </button>
                                        {helpIcon && <WrappedHelpIcon />}
                                    </div>
                                )
                            default:
                                return (
                                    <input
                                        key={attrs.name}
                                        name={attrs.name}
                                        type={attrs.type}
                                        defaultValue={attrs.value}
                                        required={attrs.required}
                                        disabled={attrs.disabled}
                                    />
                                )
                        }
                    }
                })}
            </>
        )
    }

    return (
        <>
            <PasskeyModal visible={passKeyModalVisible} setVisible={setPassKeyModalVisible} />
            <form action={flow.ui.action} method={flow.ui.method}>
                <div className="passwordless-form-section-container">
                    <PasswordlessOptionsHeader />
                    <div className='passwordless-inputs-container'>
                        <Nodes attributes />
                        {children}
                    </div>
                </div>
            </form>
        </>
    )
}

export const PasskeySignIn = () => {
    return (
        <div className='passwordless-form-section-container'>
            <PasswordlessOptionsHeader />
            <div className='passwordless-inputs-container'>
                <div className='passwordless-button-container'>
                    <button
                        className='passwordless-button'
                        name="method"
                        value="webauthn"
                    >
                        <PasskeyIcon />
                        Passkey
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordlessForm
