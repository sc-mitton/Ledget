import React, { createContext, useCallback, useState, useEffect } from "react"

import { useSearchParams } from "react-router-dom"

import { sdk, sdkError } from "../api/sdk"


const LoginFlowContext = createContext(null)
const RegisterFlowContext = createContext(null)


function LoginFlowContextProvider({ children }) {
    const [flow, setFlow] = useState(null)
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
            .createBrowserLoginFlow({ refresh: true, aal: aal2 ? "aal2" : "aal1" })
            // flow contains the form fields and csrf token
            .then(({ data: flow }) => {
                // Update URI query params to include flow id
                setSearchParams({})
                // Set the flow data
                setFlow(flow)
            })
            .finally(() => setAuthenticating(false))
    }

    const data = {
        flow,
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
    const [responseError, setResponseError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [registering, setRegistering] = useState(false)

    const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", setResponseError, true)

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
            .catch(sdkErrorHandler)
    }

    useEffect(() => {
        // we might redirect to this page after the flow is initialized,
        // so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        if (flowId) {
            getFlow(flowId).catch(createFlow) // Get new flow if it's expired
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
        setRegistering(true)
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
            .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: body })
            .then(() => {
                // we successfully submitted the login flow, so lets redirect to the dashboard
                navigate("/", { replace: true })
            })
            .finally(() => setRegistering(false))
    }

    const data = {
        flow,
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


export { LoginFlowContext, LoginFlowContextProvider, RegisterFlowContext, RegisterFlowContextProvider }
