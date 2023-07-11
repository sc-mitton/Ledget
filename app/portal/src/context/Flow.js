import React, { createContext, useCallback, useState, useEffect } from "react"

import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom"

import { sdk, sdkError } from "../api/sdk"
import AuthContext from "./AuthContext"

const LoginFlowContext = createContext(null)
const RegisterFlowContext = createContext(null)
const VerificationFlowContext = createContext(null)
const RecoveryFlowContext = createContext(null)

function LoginFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [csrf, setCsrf] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [authenticating, setAuthenticating] = useState(false)
    const { setUser } = React.useContext(AuthContext)

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
        responseError,
        csrf,
        authenticating,
        createFlow,
        getFlow,
        submit,
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
    const [registering, setRegistering] = useState(false)

    const [, setSearchParams] = useSearchParams()
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
                const flow_id = response.data.continue_with?.[0].flow?.id
                navigate({
                    pathname: '/verification',
                    search: createSearchParams({
                        flow: flow_id
                    }).toString(),
                })
            })
            .catch(sdkErrorHandler)
            .finally(() => setRegistering(false))
    }

    const data = {
        flow,
        csrf,
        responseError,
        registering,
        createFlow,
        getFlow,
        submit,
    }

    return (
        <RegisterFlowContext.Provider value={data}>
            {children}
        </RegisterFlowContext.Provider>
    )
}

function VerificationFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [codeError, setCodeError] = useState(false)
    const [csrf, setCsrf] = useState(null)
    const [verifying, setVerifying] = useState(false)

    const [, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const getFlow = useCallback(
        (flowId) =>
            sdk
                .getVerificationFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

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

    const createFlow = () => {
        sdk
            .createBrowserVerificationFlow()
            .then(({ data: flow }) => {
                setSearchParams({ ["flow"]: flow.id })
                setFlow(flow)
            })
            .catch((err) => {
                setResponseError(
                    'Well this is awkward... something went wrong.\n Please try back again later.'
                )
            })
    }

    const submit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)

        // Filter out any fields that shouldn't be submitted
        let body = {}
        const keys = ['csrf_token', 'email', 'code']
        for (let [key, value] of formData.entries()) {
            keys.includes(key) && (body[key] = value)
        }

        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        if ("submitter" in event.nativeEvent) {
            const method = (event.nativeEvent).submitter
            body['method'] = method.value
        }

        body.code && setVerifying(true)
        sdk
            .updateVerificationFlow({
                flow: flow.id,
                updateVerificationFlowBody: body,
            })
            .then((response) => {
                const messages = response.data.ui?.messages || []
                console.log(response.data)
                for (const message of messages) {
                    if (message.text.includes('code is invalid') || message.id === 4070006) {
                        setCodeError(true)
                        return
                    }
                }
                body.code && navigate('/checkout')
            })
            .catch((err) => {
                setResponseError()
            })
            .finally(() => setVerifying(false))
    }

    const data = {
        flow,
        responseError,
        codeError,
        verifying,
        csrf,
        createFlow,
        getFlow,
        submit
    }

    return (
        <VerificationFlowContext.Provider value={data}>
            {children}
        </VerificationFlowContext.Provider>
    )
}

function RecoveryFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [csrf, setCsrf] = useState(null)
    const [recovering, setRecovering] = useState(false)
    const [, setSearchParams] = useSearchParams()
    const [codeSent, setCodeSent] = useState(false)

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

    const createFlow = () => {
        console.log('creating recovery flow')
        sdk
            .createBrowserRecoveryFlow()
            .then(({ data: flow }) => {
                // set the flow data
                setFlow(flow)
                setSearchParams({ ["flow"]: flow.id })
            })
            .catch((err) => {
                // Couldn't create login flow
                // handle the error
                console.log(err)
            })
    }

    const getFlow = useCallback(
        (flowId) =>
            sdk
                .getRecoveryFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

    const submit = (event) => {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        let body = Object.fromEntries(formData)

        console.log(body)

        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        if ("submitter" in event.nativeEvent) {
            const method = (event.nativeEvent).submitter
            body['method'] = method.value
        }

        sdk
            .updateRecoveryFlow({
                flow: flow.id,
                updateRecoveryFlowBody: body,
            })
            .then((response) => {
                console.log(response)
                setCodeSent(true)
            })
            .catch((err) => {
                setResponseError()
            })
    }


    const data = {
        flow,
        csrf,
        responseError,
        recovering,
        codeSent,
        createFlow,
        getFlow,
        submit
    }

    return (
        <RecoveryFlowContext.Provider value={data}>
            {children}
        </RecoveryFlowContext.Provider>
    )
}

export {
    LoginFlowContext,
    LoginFlowContextProvider,
    RegisterFlowContext,
    RegisterFlowContextProvider,
    VerificationFlowContext,
    VerificationFlowContextProvider,
    RecoveryFlowContext,
    RecoveryFlowContextProvider
}
