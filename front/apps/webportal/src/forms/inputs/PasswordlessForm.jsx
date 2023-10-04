import React, { useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import { filterNodesByGroups, isUiNodeInputAttributes } from '@ory/integrations/ui'

import { PasskeyIcon, HelpIcon } from "@ledget/shared-assets"
import './styles/PasswordlessFormSection.css'
import { GrayWideButton } from '@ledget/shared-ui'


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
    const [searchParams, setSearchParams] = useSearchParams()

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
        const handleClick = () => {
            let updatedSearchParams = new URLSearchParams(searchParams.toString())
            updatedSearchParams.set('help', 'true')
            setSearchParams(updatedSearchParams.toString())
        }

        return (
            <button
                className="help-icon-tip"
                aria-label="Learn more about authentication with passkeys"
                onClick={handleClick}
                tabIndex={0}
                type="button"
            >
                <HelpIcon />
            </button >
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
                                        <GrayWideButton
                                            disabled={attrs.disabled}
                                            {...submit}
                                        >
                                            <PasskeyIcon />
                                            <div style={{ marginLeft: '4px' }}>Passkey</div>
                                        </GrayWideButton>
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
                <GrayWideButton
                    name="webauthn_register_trigger"
                    value="webauthn"
                >
                    <PasskeyIcon />
                    <div style={{ marginLeft: '4px' }}>Passkey</div>
                </GrayWideButton>
            </div>
        </div>
    )
}

export default PasswordlessForm
