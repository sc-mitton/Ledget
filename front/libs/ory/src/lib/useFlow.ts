import { useState, useEffect } from "react"

import { useSearchParams } from "react-router-dom"

import { UseLazyQuery, UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { EndpointRootNames, OryGetFlowEndpoint, OryCompleteFlowEndpoint } from './types'

const formatErrorMessages = (errorMessages: { id: number, [key: string]: any }[]) => {
    const filteredMessages = []
    console.log(errorMessages)
    for (const message of errorMessages) {
        switch (message.id) {
            case 4000006:
                filteredMessages.push("Wrong email or password.")
                break
            case 4000007:
                filteredMessages.push("Hmm, something's not right. Please try again.")
                break
            case 4000008:
                break
            default:
                filteredMessages.push("Hmm, something's not right. Please try again later.")
                break
        }
    }
    return filteredMessages
}

const extractData: React.FormEventHandler<HTMLFormElement> = (event) => {
    // map the entire form data to JSON for the request body
    const formData = new FormData(event.target as any)
    let body = Object.fromEntries(formData as any)

    // remove empty values
    body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== ""))

    // We need the method specified from the name and value of the submit button.
    // when multiple submit buttons are present, the clicked one's value is used.
    // We need the method specified from the name and value of the submit button.
    // when multiple submit buttons are present, the clicked one's value is used.
    if ("submitter" in event.nativeEvent) {
        const method = (event.nativeEvent).submitter as HTMLButtonElement
        body = {
            ...body,
            ...{ [method.name]: method.value },
        }
    }
    return body
}

export const useFlow = <TFlow extends EndpointRootNames>(query: UseLazyQuery<OryGetFlowEndpoint<TFlow>>, mutation: UseMutation<OryCompleteFlowEndpoint<TFlow>>, flowType: TFlow) => {
    const [errMsg, setErrMsg] = useState<string[]>()
    const [errId, setErrId] = useState<string | number>('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [mutationCacheKey, setMutationCacheKey] = useState<string>('')

    const [
        getFlow,
        {
            data: flow,
            error: getFlowError,
            isError: isGetFlowError,
            isLoading: isGettingFlow,
            isSuccess: isGetFlowSuccess,
        }
    ] = query()
    const [
        completeFlow,
        {
            data: result,
            error: completeError,
            isLoading: isCompletingFlow,
            isError: isCompleteError,
            isSuccess: isCompleteSuccess,
            isUninitialized: isCompleteUninitialized,
            reset: resetCompleteFlow,
        },
    ] = mutation({ fixedCacheKey: mutationCacheKey })
    // Fixed cache key because sometimes we reauth before going to a
    // target component, and we don't want the mutation results to carry
    // overy in between

    const fetchFlow = (args: { aal?: string, refresh?: boolean } | void) => {
        // If the aal param is different, this means a new flow is needed
        // and the search param flow id can't be used

        const aal = args?.aal
        const refresh = args?.refresh
        const flowId = searchParams.get('flow')

        if (aal === 'aal2' && aal !== searchParams.get('aal')) {
            searchParams.delete('flow')
            setSearchParams(searchParams)
            setMutationCacheKey('')
        }
        if (aal) {
            searchParams.set('aal', aal)
            setSearchParams(searchParams)
        }

        const params = {
            ...(aal === 'aal2' && aal !== searchParams.get('aal') ? { id: flowId } : {}),
            ...(aal ? { aal: aal } : {}),
            ...(refresh ? { refresh: true } : {}),
        }

        getFlow({ params: params }, true)
    }

    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        setErrMsg(undefined)
        const data = extractData(event)
        const flowId = searchParams.get('flow')
        completeFlow({ data: data, params: { flow: flowId } } as any)
    }

    const submitData = (data: any) => {
        setErrMsg(undefined)
        const flowId = searchParams.get('flow')
        completeFlow({ data: data, params: { flow: flowId } } as any)
    }

    useEffect(() => {
        if (searchParams.get('flow')) {
            setMutationCacheKey(`${searchParams.get('flow')}${searchParams.get('aal') || ''}`)
        }
    }, [searchParams])

    // Update search params
    useEffect(() => {
        if (isGetFlowSuccess) {
            if (flow && 'id' in flow) {
                searchParams.set('flow', flow?.id)
                setSearchParams(searchParams)
            }
        }
    }, [isGetFlowSuccess, flow])

    // Error handler
    useEffect(() => {
        if (!completeError && !getFlowError) { return }

        const errorData = completeError?.data || getFlowError?.data
        const status = completeError?.status || getFlowError?.status

        const errorMessages = errorData?.ui?.messages

        if (errorMessages) {
            setErrMsg(formatErrorMessages(errorMessages))
            setErrId(errorMessages[0].id)
        } else {
            if (errorData?.error) {
                setErrMsg(errorData.error.message)
            }

            if (errorData?.error?.id) {
                setErrId(errorData.error.id)
            }
        }

        switch (status) {
            case 400: {
                if (errorData.id === "session_already_available") {
                    console.error("session_already_available")
                    setErrId("session_already_available")
                }
                break
            }
            case 401: {
                console.warn("sdkError 401")
                break
            }
            case 403: {
                // Session is too old usually, and we need to start a new flow
                // console.warn("sdkError 403")
                // searchParams.delete('flow')
                // setSearchParams(searchParams)
                // navigate(0)
                break
            }
            case 422: {
                console.log("sdkError 422")
                if (errorData.redirect_browser_to !== undefined) {
                    const currentUrl = new URL(window.location.href)

                    // need to add the base url since the `redirect_browser_to`
                    // is a relative url with no hostname
                    const redirect = new URL(errorData.redirect_browser_to, window.location.origin)

                    // If hostnames are differnt, redirect to the redirect url
                    if (currentUrl.hostname !== redirect.hostname) {
                        console.warn("sdkError 422: Redirect browser to")
                        window.location.href = errorData.redirect_browser_to
                    }
                }
                break
            }
            case 200:
                break
            // 410 responses are already handled in the api Slice, but that
            // only accounts for getting the flow, not submitting it. This
            // handles that.
            case 410:
                searchParams.delete('flow')
                setSearchParams(searchParams)
                let params: any = {}
                for (const key of searchParams.keys()) {
                    params[key] = searchParams.get(key)
                }
                getFlow({ params: params } as any)
                setErrMsg(["Please try again."])
                break
            default:
                console.error(errorData)
        }
    }, [isGetFlowError, isCompleteError])

    return {
        flow,
        fetchFlow,
        completeFlow,
        submit,
        submitData,
        result,
        resetCompleteFlow,
        flowStatus: {
            errMsg,
            errId,
            isGetFlowError,
            isGetFlowSuccess,
            isGettingFlow,
            completeError,
            isCompletingFlow,
            isCompleteError,
            isCompleteSuccess,
            isCompleteUninitialized,
        },
        mutationCacheKey
    }
}
