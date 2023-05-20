import React, { useRef, useState, useEffect, useContext, useCallback } from "react"

import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

import { sdk, sdkError } from "../../api/sdk"
import './style/Login.css'
import webAuthn from "../../assets/icons/webAuthn.svg"
import Help from "../../assets/icons/Help"
import logo from "../../assets/images/logo.svg"
import FacebookLogo from "../../assets/icons/FacebookLogo"
import GoogleLogo from "../../assets/icons/GoogleLogo"
import { PasswordInput } from "./CustomInputs"
import { Checkbox } from "./CustomInputs"
import { FormError, WindowLoadingBar } from "../widgets/Widgets"

function SocialLogin() {
    return (
        <div className="social-login-container">
            <div>Or sign in with</div>
            <div>
                <button
                    className="social-auth-button"
                    id='google-login'
                    aria-label="Google login"
                >
                    <GoogleLogo />
                </button>
                <button
                    className="social-auth-button"
                    id='facebook-login'
                    aria-label="Facebook login"
                >
                    <FacebookLogo />
                </button >
            </div>
        </div>
    )
}

const schema = object().shape({
    email: string().email("Invalid email address."),
})

const LoginForm = ({ onLoginSubmit }) => {
    const [errMsg, setErrMsg] = useState('')
    const rememberRef = useRef()
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const emailRef = useRef()
    const { ref, ...rest } = register('email')

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    return (
        <form onSubmit={handleSubmit(onLoginSubmit)} className="login-form" noValidate>
            <div>
                {errors['email'] && <FormError msg={errors['email'].message} />}
                <div className="input-container">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        {...rest}
                        ref={(e) => {
                            ref(e)
                            emailRef.current = e
                        }}
                    />
                </div>
                <div id="remember-me-checkbox-container">
                    <Checkbox
                        id='remember'
                        label='Remember me'
                        name='remember'
                        ref={rememberRef}
                    />
                </div>
                <button
                    className='charcoal-button'
                    id="next"
                    name="enter-password"
                    type="submit"
                    aria-label="Next"
                >
                    Continue
                </button>
            </div>
        </form >
    )
}

const Initial = ({ setEmail }) => {

    const onLoginSubmit = (data) => {
        setEmail(data.email)
    }

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Sign In</h2>
            <LoginForm onLoginSubmit={onLoginSubmit} />
            <SocialLogin />
            <div
                className="below-window-container"
            >
                <span>Don't have an account? </span>
                <Link
                    className="underline-link-animation"
                    to={{ pathname: "/register", state: { direction: 1 } }}
                >
                    Sign Up
                </Link>
            </div>
        </>
    )
}

const AuthenticationForm = ({ flow, onSubmit, email, setEmail }) => {
    const pwdRef = useRef()

    useEffect(() => {
        if (flow?.ui?.action != "") {
            pwdRef.current.focus()
        }
    }, [flow])

    return (
        <form
            action={flow.ui.action}
            method={flow.ui.method}
            onSubmit={onSubmit}
            id="authentication-form"
        >
            <PasswordInput ref={pwdRef} />
            <input type="hidden" name="csrf_token" value={flow.csrf_token} />
            <input type="hidden" name="email" value={email} />
            <div>
                <button
                    className='charcoal-button'
                    id="sign-in"
                    name="sign-in"
                    type="submit"
                    aria-label="Sign in"
                >
                    Sign In
                </button>
            </div>
            <div id="passwordless-options">
                <div id="passwordless-options-header">
                    Passwordless
                    <div className="help-icon">
                        <Help />
                    </div>
                </div>
                <div>
                    <button
                        name="passwordless-options"
                        type="submit"
                    >
                        <img src={webAuthn} id="webauthn-icon" alt='webauthn icon' />
                    </button>
                </div>
            </div>
        </form >
    )
}


const Authenticate = ({ email, setEmail }) => {
    const [flow, setFlow] = useState(null)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const emptyFlow = { ui: { action: "", method: "" }, csrf_token: "" }
    const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", true)

    const getFlow = useCallback(
        (flowId) =>
            sdk
                // the flow data contains the form fields, error messages and csrf token
                .getLoginFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow))
                .catch(sdkErrorHandler),
        [],
    )

    const createFlow = () => {
        const aal2 = searchParams.get("aal2")
        const returnTo = searchParams.get("return_to")

        sdk
            // aal2 is a query parameter that can be used to request Two-Factor authentication
            // aal1 is the default authentication level (Single-Factor)
            // we always pass refresh (true) on login so that the session can be
            // refreshed when there is already an active session
            .createBrowserLoginFlow({ refresh: true, aal: aal2 ? "aal2" : "aal1" })
            // flow contains the form fields and csrf token
            .then(({ data: flow }) => {
                // Update URI query params to include flow id
                setSearchParams({
                    flow: flow.id,
                    return_to: returnTo || "/",
                    aal: aal2 ? 'aal2' : 'aal1',
                })
                // Set the flow data
                setFlow(flow)
            })
            .catch(sdkErrorHandler)
    }

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        const returnTo = searchParams.get("return_to")
        const aal2 = searchParams.get("aal2")
        // the flow already exists
        if (flowId) {
            getFlow(flowId).catch(createFlow) // if the flow has expired, we need to get a new one
            return
        }
        createFlow()
    }, [])

    const submit = (event) => {
        event.preventDefault()

        // map the entire form data to JSON for the request body
        const form = event.currentTarget
        const formData = new FormData(form)
        let body = Object.fromEntries(formData)

        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        if ("submitter" in event.nativeEvent) {
            const method = event.nativeEvent.submitter;
            body = {
                ...body,
                ...{ [method.name]: method.value },
            }
        }

        sdk
            .updateLoginFlow({
                flow: flow.id,
                updateLoginFlowBody: body,
            })
            .then(() => {
                console.log('success')
            })
            .catch((err) => {
                // handle the error
                if (err.response.status === 400) {
                    // user input error
                    // show the error messages in the UI
                    setFlow(err.response.data)
                }
            })
    }

    const mapUINode = (node, key) => {
        // other node types are also supported
        // if (isUiNodeTextAttributes(node.attributes)) {
        // if (isUiNodeImageAttributes(node.attributes)) {
        // if (isUiNodeAnchorAttributes(node.attributes)) {
        if (isUiNodeInputAttributes(node.attributes)) {
            const attrs = node.attributes
            const nodeType = attrs.type

            switch (nodeType) {
                case "button":
                case "submit":
                    return (
                        <button
                            type={attrs.type}
                            name={attrs.name}
                            value={attrs.value}
                            key={key}
                        />
                    )
                default:
                    return (
                        <input
                            name={attrs.name}
                            type={attrs.type}
                            autoComplete={
                                attrs.autocomplete || attrs.name === "identifier"
                                    ? "username"
                                    : ""
                            }
                            defaultValue={attrs.value}
                            required={attrs.required}
                            disabled={attrs.disabled}
                            key={key}
                        />
                    )
            }
        }
    }

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <div id="email-container">
                <span>{`${email}`}</span>
                <a
                    onClick={() => setEmail('')}
                >
                    change
                </a>
            </div>
            {!flow &&
                <WindowLoadingBar />
            }
            <AuthenticationForm
                flow={flow ? flow : emptyFlow}
                onSubmit={submit}
                email={email}
                setEmail={setEmail}
            />
            <div className="below-window-container">
                <Link to="#" tabIndex={0} >Forgot Password?</Link>
            </div>
        </>
    )
}

function LoginWindow() {
    const [email, setEmail] = useState('')
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {email === '' ?
                <motion.div
                    className='window'
                    key="initial"
                    initial={{ opacity: 0, x: !loaded ? 0 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <Initial setEmail={setEmail} />
                </motion.div>
                :
                <motion.div
                    className='window'
                    key="authenticate"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                >
                    <Authenticate email={email} setEmail={setEmail} />
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default LoginWindow
