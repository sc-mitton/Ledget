import React, { createContext, useCallback, useState, useEffect } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"

import { sdk, sdkError } from "../api/sdk"
import AuthContext from "./AuthContext"


const LoginFlowContext = createContext(null)
const RegisterFlowContext = createContext(null)
const VerificationContext = createContext(null)


function LoginFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [csrf, setCsrf] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [authenticating, setAuthenticating] = useState(false)
    const { user, setUser } = React.useContext(AuthContext)

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
                    aal: aal2 ? 'aal2' : 'aal1',
                })
                // Set the flow data
                setFlow(flow)
            })
    }

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

    const submit = (event) => {
        event.preventDefault()
        // map the entire form data to JSON for the request body
        setAuthenticating(true)
        const form = event.target
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
            .then((response) => {
                setUser(response.data.session.identity?.traits)
                // if not a subscriber, redirect to subscription page
                // else navigate to app
            })
            .catch(sdkErrorHandler)
            .finally(() => setAuthenticating(false))
    }

    const data = {
        flow,
        createFlow,
        getFlow,
        submit,
        responseError,
        CsrfToken,
        authenticating
    }

    return (
        <LoginFlowContext.Provider value={data}>
            {children}
        </LoginFlowContext.Provider>
    )
}

function RegisterFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [csrf, setCsrf] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [, setSearchParams] = useSearchParams()
    const [registering, setRegistering] = useState(false)
    const navigate = useNavigate()
    const { setUser } = React.useContext(AuthContext)

    const sdkErrorHandler = sdkError(getFlow, setFlow, "/register", setResponseError, false)

    const getFlow = useCallback(
        (flowId) =>
            sdk
                // the flow data contains the form fields, error messages and csrf token
                .getRegistrationFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

    const createFlow = () => {
        sdk
            .createBrowserRegistrationFlow()
            .then(({ data: flow }) => {
                setSearchParams({ ["flow"]: flow.id })
                setFlow(flow)
            })
            .catch(
                sdkErrorHandler
            )
    }

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

    const submit = (event) => {
        // map the entire form data to JSON for the request body
        setRegistering(true)
        const form = event.target
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
        delete body.confirmPassword

        sdk
            .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: body })
            .then((response) => {
                setUser(response.data.identity)
                sessionStorage.setItem('user', JSON.stringify(response.data.identity))
                navigate('/verification')
            })
            .catch(sdkErrorHandler)
            .finally(() => setRegistering(false))
    }

    const data = {
        flow,
        createFlow,
        getFlow,
        submit,
        responseError,
        CsrfToken,
        registering
    }

    return (
        <RegisterFlowContext.Provider value={data}>
            {children}
        </RegisterFlowContext.Provider>
    )
}

function VerificationContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [, setSearchParams] = useSearchParams()
    const [responseError, setResponseError] = useState('')
    const [csrf, setCsrf] = useState(null)
    const [verifying, setVerifying] = useState(false)
    const { user, setUser } = React.useContext(AuthContext)

    const getFlow = useCallback(
        (flowId) =>
            sdk
                .getVerificationFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

    const createFlow = () => {
        sdk
            .createBrowserVerificationFlow()
            .then(({ data: flow }) => {
                setSearchParams({ ["flow"]: flow.id })
                setFlow(flow)
            })
            .catch((err) => {
                setResponseError('Something went wrong. Please try again later.')
            })
    }

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

    const submit = (event) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        // map the entire form data to JSON for the request body
        let body = Object.fromEntries(
            formData,
        )

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
            .updateVerificationFlow({
                flow: flow.id,
                updateVerificationFlowBody: body,
            })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    // user input error
                    // show the error messages in the UI
                    setResponseError(err.response.data.error.message)
                }
            })
    }

    const data = {
        flow,
        responseError,
        verifying,
        createFlow,
        getFlow,
        CsrfToken,
        submit
    }

    return (
        <VerificationContext.Provider value={data}>
            {children}
        </VerificationContext.Provider>
    )
}

export {
    LoginFlowContext,
    LoginFlowContextProvider,
    RegisterFlowContext,
    RegisterFlowContextProvider,
    VerificationContext,
    VerificationContextProvider
}
