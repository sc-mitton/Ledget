import { useEffect, useState } from "react"

import { useLocation } from "react-router-dom"

import CsrfToken from "./inputs/CsrfToken"
import { FacebookLoginButton, GoogleLoginButton } from "@ledget/ui"

function SocialAuth({ flow, submit }) {
    const location = useLocation()
    const [socialNodes, setSocialNodes] = useState([])

    useEffect(() => {
        setSocialNodes(flow && flow.ui.nodes.filter(node => node.group === 'oidc'))
    }, [flow])

    const SocialLoginButtons = () => {
        return (
            <>
                {socialNodes.map(node => {
                    return (
                        node.attributes.value === 'facebook' &&
                        <FacebookLoginButton
                            id={node.id}
                            {...node.attributes}
                            key={'facebook-login'}
                            aria-label="facebook login"
                        />
                        || node.attributes.value === 'google' &&
                        <GoogleLoginButton
                            id={node.id}
                            {...node.attributes}
                            key={'google-login'}
                            aria-label="google login"
                        />
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
                onSubmit={submit}
            >
                {socialNodes ?
                    <SocialLoginButtons />
                    : <DefaultButtons />
                }
                <CsrfToken csrf={flow?.csrf_token} />
            </form>
        </div>
    )
}

export default SocialAuth
