import React, { createContext, useCallback, useState, useEffect, useContext } from "react"

import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom"

import { sdk, sdkError } from "../api/sdk"
import UserContext from "./UserContext"

const LoginFlowContext = createContext(null)
const RegisterFlowContext = createContext(null)
const VerificationFlowContext = createContext(null)
const RecoveryFlowContext = createContext(null)

const loginRedirectUri = import.meta.env.VITE_LOGIN_REDIRECT

function LoginFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
    const [csrf, setCsrf] = useState(null)
    const [responseError, setResponseError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [authenticating, setAuthenticating] = useState(false)
    const { setUser } = useContext(UserContext)

    const getFlow = useCallback(
        (flowId) =>
            sdk
                // the flow data contains the form fields, error messages and csrf token
                .getLoginFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow))
                .catch(sdkErrorHandler),
        [],
    )

    const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", setResponseError, true)

    const createFlow = () => {
        const aal2 = searchParams.get("aal2")
        const returnTo = searchParams.get("return_to")

        sdk
            // aal2 to request Two-Factor authentication
            // aal1 is the default authentication level (Single-Factor)
            // if the user has a session, refresh it
            .createBrowserLoginFlow({
                returnTo: returnTo || loginRedirectUri,
                refresh: true,
                aal: aal2 ? "aal2" : "aal1"
            })
            // flow contains the form fields and csrf token
            .then(({ data: flow }) => {
                // Update URI query params to include flow id
                setSearchParams({
                    flow: flow.id,
                    aal: aal2 ? 'aal2' : 'aal1',
                    return_to: flow.return_to
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
                if (response.status === 200) {
                    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
                }
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
    const { setUser } = useContext(UserContext)

    const getFlow = useCallback(
        (flowId) =>
            sdk
                // the flow data contains the form fields, error messages and csrf token
                .getRegistrationFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

    const sdkErrorHandler = sdkError(getFlow, setFlow, "/register", setResponseError, false)

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
                    pathname: '/register/verification',
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

    const handleMessage = (message) => {
        // Verification codes docs:
        // https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
        switch (message.id) {
            case (4070006):
                setCodeError(true)
                break
            case (407005 || 407003):
                // Expired verification flow
                // Send new email & navigate to verification page
                // which will create a new verification flow
                navigate('/register/verification')
                break
            case (1080002):
                // Successful verification
                navigate('/register/checkout')
                break
            case (1080003 || 1080002):
                // Email w/ code/link sent
                break
            default:
                setResponseError('Well this is awkward... something went wrong.\n Please try back again later.')
                break
        }
    }

    const callVerificationApi = async (body) => {

        body.code && setVerifying(true)
        sdk
            .updateVerificationFlow({
                flow: flow.id,
                updateVerificationFlowBody: body,
            })
            .then((response) => {
                const messages = response.data.ui?.messages || []
                for (const message of messages) {
                    handleMessage(message)
                }
            })
            .catch((err) => {
                setResponseError(
                    'Well this is awkward... something went wrong.\n Please try back again later.'
                )
            })
            .finally(() => setVerifying(false))
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

        callVerificationApi(body)
    }

    const data = {
        flow,
        responseError,
        codeError,
        verifying,
        csrf,
        createFlow,
        getFlow,
        submit,
        callVerificationApi
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

    useEffect(() => {
        if (!codeSent) {
            setCodeSent(
                Boolean(sessionStorage.getItem('recovery_email'))
            )
        }
    }, [])

    const createFlow = () => {
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
                setResponseError(
                    'Well this is awkward... something went wrong. Please try back again later.'
                )
            })
    }

    const handleMessage = (message) => {
        // Recovery codes docs:
        // https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
        switch (message.id) {
            case (1060002 || 106003):
                // Email w/ code/link sent
                setCodeSent(true)
                break
            case (4060002 || 4060006 || 4060005 || 4060004):
                // Flow in failure state  - 4060002
                // Code already used or invalid  - 4060006
                // Expired flow  - 4060005
                // Token already used or invalid - 4060004
                break
            default:
                setResponseError('Well this is awkward... something went wrong.\n Please try back again later.')
                break
        }
    }

    const callRecoveryApi = (body) => {
        body.code && setRecovering(true)
        sdk
            .updateRecoveryFlow({
                flow: flow.id,
                updateRecoveryFlowBody: body,
            })
            .then((response) => {
                !codeSent && setCodeSent(true)
                const messages = response.data.ui?.messages || []
                for (const message of messages) {
                    handleMessage(message)
                }
            })
            .catch((err) => {
                setResponseError(
                    'Well this is awkward... something went wrong. Please try back again later.'
                )
            })
            .finally(() => setRecovering(false))
    }

    const getFlow = useCallback(
        (flowId) =>
            sdk
                .getRecoveryFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow)),
        [],
    )

    // Submit the form (handles both requesting the code and entering it)
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

        callRecoveryApi(body)
    }


    const data = {
        flow,
        csrf,
        responseError,
        recovering,
        codeSent,
        setCodeSent,
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
