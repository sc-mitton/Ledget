// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from "react"

import { Configuration, FrontendApi } from "@ory/client"
import { useNavigate } from "react-router-dom"

export const sdk = new FrontendApi(
    new Configuration({
        basePath: process.env.REACT_APP_ORY_TUNNEL,
        baseOptions: {
            withCredentials: true,
        },
    })
)

/**
 * @param getFlow - Should be function to load a flow make it visible (Login.getFlow)
 * @param setFlow - Update flow data to view (Login.setFlow)
 * @param defaultNav - Default navigate target for errors
 * @param fatalToDash - When true and error can not be handled, then redirect to dashboard, else rethrow error
 */
export const sdkError = (
    getFlow,
    setFlow,
    defaultNav,
    setResponseError,
    fatalToDash = false,
) => {
    const navigate = useNavigate()

    return useCallback(
        (error) => {
            const responseData = error.response?.data || {}
            const errorMessages = responseData.ui?.messages.filter((m) => m.type === "error") || []
            const error_id = responseData.error?.id

            switch (error.response?.status) {
                case 400: {
                    if (error_id === "session_already_available") {
                        console.log("session_already_available")
                        navigate("/", { replace: true }) // TODO redirect to app instead of login
                    } else if (errorMessages[0].text.includes("credentials are invalid")) {
                        setResponseError('Wrong email or password.')
                    } else if (errorMessages[0].text.includes("An account with the same identifier")) {
                        setResponseError("Hmm, something's not right. Please try again.")
                    } else if (setFlow !== undefined) {
                        // the request could contain invalid parameters which would set error messages in the flow
                        console.warn("sdkError 400: update flow data")
                        setFlow(responseData)
                    }
                    return Promise.resolve()
                }
                case 401: {
                    console.warn("sdkError 401: Navigate to /login")
                    navigate("/login", { replace: true })
                    return Promise.resolve()
                }
                case 403: {
                    // the user might have a session, but would require 2FA (Two-Factor Authentication)
                    if (responseData.error?.id === "session_aal2_required") {
                        navigate("/login?aal2=true", { replace: true })
                        return Promise.resolve()
                    }

                    if (
                        responseData.error?.id === "session_refresh_required" &&
                        responseData.redirect_browser_to
                    ) {
                        console.warn("sdkError 403: Redirect browser to")
                        window.location = responseData.redirect_browser_to
                        return Promise.resolve()
                    }
                    break
                }
                case 404: {
                    if (defaultNav !== undefined) {
                        console.warn("sdkError 404: Navigate to Error")
                        const errorMsg = {
                            data: error.response?.data || error,
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            url: window.location.href,
                        }

                        navigate(
                            `/error?error=${encodeURIComponent(
                                JSON.stringify(errorMsg)
                            )}`,
                            {
                                replace: true,
                            }
                        )
                        return Promise.resolve()
                    }
                    break
                }
                case 410: {
                    if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
                        console.warn("sdkError 410: Update flow")
                        return getFlow(responseData.use_flow_id).catch((error) => {
                            // Something went seriously wrong - log and redirect to defaultNav if possible
                            console.error(error)

                            if (defaultNav !== undefined) {
                                navigate(defaultNav, { replace: true })
                            } else {
                                // Rethrow error when can't navigate and let caller handle
                                throw error
                            }
                        })
                    } else if (defaultNav !== undefined) {
                        console.warn("sdkError 410: Navigate to", defaultNav)
                        navigate(defaultNav, { replace: true })
                        return Promise.resolve()
                    }
                    break
                }
                case 422: {
                    if (responseData.redirect_browser_to !== undefined) {
                        const currentUrl = new URL(window.location.href)
                        const redirect = new URL(
                            responseData.redirect_browser_to,
                            // need to add the base url since the `redirect_browser_to` is a relative url with no hostname
                            window.location.origin,
                        )

                        // If hostnames are differnt, redirect to the redirect url
                        if (currentUrl.hostname !== redirect.hostname) {
                            console.warn("sdkError 422: Redirect browser to")
                            window.location.href = responseData.redirect_browser_to
                            return Promise.resolve()
                        }
                        // Path has changed
                        if (currentUrl.pathname !== redirect.pathname) {
                            console.warn("sdkError 422: Update path")
                            // remove /ui prefix from the path in case it is present
                            // (not setup correctly inside the project config)
                            // since this is an SPA we don't need to redirect to the Account Experience.
                            redirect.pathname = redirect.pathname.replace("/ui", "")
                            navigate(redirect.pathname + redirect.search, {
                                replace: true,
                            })
                            return Promise.resolve()
                        }

                        // for webauthn we need to reload the flow
                        const flowId = redirect.searchParams.get("flow")

                        if (flowId != null && getFlow !== undefined) {
                            // get new flow data based on the flow id in the redirect url
                            console.warn("sdkError 422: Update flow")
                            return getFlow(flowId).catch((error) => {
                                // Something went seriously wrong - log and redirect to defaultNav if possible
                                console.error(error)

                                if (defaultNav !== undefined) {
                                    navigate(defaultNav, { replace: true })
                                } else {
                                    // Rethrow error when can't navigate and let caller handle
                                    throw error
                                }
                            })
                        } else {
                            console.warn("sdkError 422: Redirect browser to")
                            window.location = responseData.redirect_browser_to
                            return Promise.resolve()
                        }
                    }
                }
                default: {
                    console.warn("error", error)
                    setResponseError('Something went wrong. Please try again later.')
                    navigate(defaultNav, { replace: true })
                    return Promise.resolve()
                }
            }

            console.error(error)

            if (fatalToDash) {
                console.warn("sdkError: fatal error redirect to /")
                navigate("/", { replace: true })
                return Promise.resolve()
            }

            throw error
        },
        [navigate, getFlow],
    )
}
