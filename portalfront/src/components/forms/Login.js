import React, { useRef, useState, useEffect, useContext, createContext, useCallback } from "react"

import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { object, string } from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { set, useForm } from "react-hook-form"

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

const FlowContext = createContext(null)

const FlowContextProvider = ({ children }) => {
    const [flow, setFlow] = useState(null)
    const [email, setEmail] = useState('')
    const [csrf, setCsrf] = useState(null)
    const [responseError, setResponseError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [authenticating, setAuthenticating] = useState(false)

    const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", setResponseError, true)

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
            // aal2 to request Two-Factor authentication
            // aal1 is the default authentication level (Single-Factor)
            // if the user has a session, refresh it
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

    useEffect(() => {
        if (!flow) {
            return
        }
        setCsrf(
            flow.ui.nodes?.find(
                node => node.group === 'default'
                    && node.attributes.name === 'csrf_token'
            )?.attributes.value
        )
    }, [flow])

    const submit = (event) => {
        event.preventDefault()
        // map the entire form data to JSON for the request body
        setAuthenticating(true)
        const form = event.currentTarget
        const formData = new FormData(form)
        let body = Object.fromEntries(formData)

        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        if ("submitter" in event.nativeEvent) {
            const method = (
                event.nativeEvent
            ).submitter
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
            .then((res) => {
                const returnTo = process.env.LOGIN_REDIRECT || "https://localhost:3001/"
                window.location.href = returnTo // Navigate to a different subdomain
            })
            .catch(sdkErrorHandler)
            .finally(() => setAuthenticating(false))
    }

    const CsrfToken = () => {
        return (
            <>
                <input
                    type="hidden"
                    name="csrf_token"
                    value={csrf || ''}
                />
            </>
        )
    }

    const data = {
        flow,
        email,
        setEmail,
        submit,
        responseError,
        CsrfToken,
        authenticating
    }

    return (
        <FlowContext.Provider value={data}>
            {children}
        </FlowContext.Provider>
    )
}

function SocialLoginForm() {
    const { flow, submit, CsrfToken } = useContext(FlowContext)

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
            <div id="social-login-header">Or sign in with</div>
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

const schema = object().shape({
    email: string().email("Invalid email address."),
})

const LoginForm = () => {
    const emailRef = useRef()
    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), mode: 'onBlur' })
    const { ref, ...rest } = register('email')
    const { flow, setEmail } = useContext(FlowContext)

    useEffect(() => {
        flow && emailRef.current.focus()
    }, [flow])

    return (
        <form
            onSubmit={handleSubmit(() => setEmail(emailRef.current.value))}
            className="login-form"
            noValidate
        >
            <div>
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
                {errors['email'] && <FormError msg={errors['email'].message} />}
                <div id="remember-me-checkbox-container">
                    <Checkbox
                        id='remember'
                        label='Remember me'
                        name='remember'
                    />
                </div>
                <button
                    className='charcoal-button'
                    id="next"
                    name="enter-password"
                    aria-label="Continue"
                    type="submit"
                >
                    Continue
                </button>
            </div>
        </form >
    )
}

const Initial = () => {
    const { flow } = useContext(FlowContext)

    return (
        <>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <h2>Sign In</h2>
            <LoginForm />
            <SocialLoginForm />
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
            {!flow && <WindowLoadingBar />}
        </>
    )
}

const Authenticate = () => {
    const [error, setError] = useState('')
    const { flow, email, setEmail, submit, responseError, authenticating } = useContext(FlowContext)

    const AuthenticationForm = () => {
        const pwdRef = useRef()
        const { flow, CsrfToken } = useContext(FlowContext)

        useEffect(() => {
            pwdRef.current.focus()
        }, [])

        return (
            <form
                action={flow.ui.action}
                method={flow.ui.method}
                onSubmit={submit}
                id="authentication-form"
            >
                <PasswordInput ref={pwdRef} />
                {error && <FormError msg={error} />}
                {responseError && <FormError msg={responseError} />}
                <div id="forgot-password-container">
                    <Link to="#" tabIndex={0} >Forgot Password?</Link>
                </div>
                <CsrfToken />
                <input
                    type="hidden"
                    name="identifier"
                    value={email || ''}
                />
                <button
                    className='charcoal-button'
                    id="sign-in"
                    name="method"
                    value="password"
                    type="submit"
                    aria-label="Sign in"
                >
                    Sign In
                </button>
                <div id="passwordless-options">
                    <div id="passwordless-options-header" >
                        Passwordless
                        <div className="help-icon">
                            <Help />
                        </div>
                    </div>
                    <div id="passwordless-options-container">
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
            {authenticating && <WindowLoadingBar />}
            <AuthenticationForm />
        </>
    )
}

function AnimatedWindows() {
    const [loaded, setLoaded] = useState(false)
    const { email } = useContext(FlowContext)

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
                    <Initial />
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
                    <Authenticate />
                </motion.div>
            }
        </AnimatePresence>
    )
}

const LoginWindow = () => {
    return (
        <FlowContextProvider>
            <AnimatedWindows />
        </FlowContextProvider>
    )
}

export default LoginWindow
