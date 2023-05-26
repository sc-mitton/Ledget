import React, { useEffect } from "react"

import { useLocation } from "react-router-dom"

import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"

function SocialAuth({ flow, submit, CsrfToken }) {
    const location = useLocation()

    const SocialLoginButtons = () => {
        return (
            flow.ui.nodes.map((node, index) => {
                if (node.group === 'oidc') {
                    return (
                        <button
                            className="social-auth-button"
                            key={index}
                            id={node.id}
                            type={node.attributes.type}
                            name={node.attributes.name}
                            value={node.attributes.value}
                            disabled={node.attributes.disabled}
                            aria-label={`${node.attributes.value} login`}
                        >
                            {node.attributes.value === 'google' && <GoogleLogo />}
                            {node.attributes.value === 'facebook' && <FacebookLogo />}
                        </button>
                    )
                }
            })
        )
    }

    const DefaultButtons = () => {
        return (
            <>
                <button
                    className="social-auth-button"
                    id="facebook"
                >
                    <FacebookLogo />
                </button>
                <button
                    className="social-auth-button"
                    id="google"
                >
                    <GoogleLogo />
                </button>
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
                onSubmit={submit}
                action={flow && flow.ui.action}
                method={flow && flow.ui.method}
                id="social-login-form"
                noValidate
            >
                {flow ?
                    <SocialLoginButtons />
                    : <DefaultButtons />
                }
                <CsrfToken />
            </form>
        </div>
    )
}

export default SocialAuth
