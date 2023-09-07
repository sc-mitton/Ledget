import React, { useEffect, useState } from "react"

import { useLocation } from "react-router-dom"

import CsrfToken from "./inputs/CsrfToken"
import { FacebookLoginButton, GoogleLoginButton } from "@ledget/shared-ui"

function SocialAuth({ flow, submit, csrf }) {
    const location = useLocation()
    const [socialNodes, setSocialNodes] = useState([])

    useEffect(() => {
        setSocialNodes(flow && flow.ui.nodes.filter(node => node.group === 'oidc'))
    }, [flow])

    const FacebookButton = (props) => (
        <FacebookLoginButton {...props} />
    )

    const GoogleButton = (props) => (
        <GoogleLoginButton {...props} />
    )
    const SocialLoginButtons = () => {
        return (
            <>
                {socialNodes.map(node => {
                    const props = {
                        id: node.id,
                        type: node.attributes.type,
                        name: node.attributes.name,
                        value: node.attributes.value,
                        disabled: node.attributes.disabled,
                        "aria-label": `${node.attributes.value} login`
                    }
                    return (
                        node.attributes.value === 'facebook' && <FacebookButton {...props} />
                        || node.attributes.value === 'google' && <GoogleButton {...props} />
                    )
                })}
            </>
        )
    }

    const DefaultButtons = () => {
        return (
            <>
                <FacebookLoginButton />
                <GoogleLoginButton />
            </>
        )
    }

    return (
        <div className="social-login-container">
            <div id="social-login-header">
                {location.pathname === '/login' ?
                    <span>Or log in with</span>
                    : <span>Or sign up with</span>
                }
            </div>
            <form
                action={flow && flow.ui.action}
                method={flow && flow.ui.method}
                id="social-login-form"
            >
                {socialNodes ?
                    <SocialLoginButtons />
                    : <DefaultButtons />
                }
                <CsrfToken csrf={csrf} />
            </form>
        </div>
    )
}

export default SocialAuth
