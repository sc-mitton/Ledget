import React, { useEffect, useState, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'

import { withSmallModal } from '@ledget/shared-utils'
import { useGetMeQuery, selectSessionIsFresh } from '@features/userSlice'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import {
    GreenSubmitWithArrow,
    SecondaryButton,
    PasswordInput,
    PlainTextInput,
    FormError,
    SlideMotionDiv,
    JiggleDiv
} from '@ledget/shared-ui'

const row1Style = { marginTop: '20px', fontWeight: '500', marginLeft: '2px' }
const row2Style = { margin: '16px 0 28px 0' }

const HiddenInputs = ({ flow }) => {
    const nodes = ['csrf_token', 'method', 'identifier']
    return (
        <>
            {flow.ui.nodes.filter(node => nodes.includes(node.attributes.name))
                .map(node => (
                    <input
                        key={node.attributes.name}
                        type="hidden"
                        name={node.attributes.name}
                        value={node.attributes.value}
                    />
                ))}
        </>
    )
}

const useFlow = (aal) => {
    const [getFlow, { data: flow, isLoading, isSuccess, isError }] = useLazyGetLoginFlowQuery()
    const [searchParams, setSearchParams] = useSearchParams()
    const sessionIsFresh = useSelector(selectSessionIsFresh)

    useEffect(() => {
        let flowId = searchParams.get('flow')
        // No need to fetch flow if session is fresh,
        // user will be passed through to component
        if (sessionIsFresh) { return }

        // If the aal param is differnt, this means a new flow is needed
        // and the search param flow id can't be used
        if (searchParams.get('aal') !== aal) {
            flowId = null
        }
        getFlow({
            params: { aal: aal, refresh: true, id: flowId }
        })
    }, [])

    // Update search params
    useEffect(() => {
        if (isSuccess) {
            setSearchParams({ flow: flow?.id, aal: aal })
        }
    }, [isSuccess, flow?.id])

    return { flow, isLoading, isError }
}

const ErrorFetchingFlow = () => (<FormError msg={"Something went wrong, please try again later."} />)

const PassWord = () => {
    const pwdRef = useRef(null)
    const [searchParams] = useSearchParams()
    const [, { isError }] = useCompleteLoginFlowMutation({ fixedCacheKey: searchParams.get('flow') })
    const { flow, isLoading, isError: errorFetchingFlow } = useFlow('aal1')

    // Focus on password input on mount
    useEffect(() => { pwdRef.current?.focus() }, [])

    // Focus on password input on error
    useEffect(() => {
        isError && pwdRef.current?.focus()
    }, [isError])

    return (
        <>
            <div className="body" style={row1Style}>
                To make this change, first confirm your login.
            </div>
            <div style={row2Style}>
                <JiggleDiv jiggle={isError}>
                    <PasswordInput ref={pwdRef} loading={isLoading} required />
                </JiggleDiv>
                {flow && <HiddenInputs flow={flow} />}
                {errorFetchingFlow && <ErrorFetchingFlow />}
            </div>
        </>
    )
}

const Totp = () => {
    const [searchParams] = useSearchParams()
    const [, isError] = useCompleteLoginFlowMutation({ fixedCacheKey: searchParams.get('flow') })
    const { flow, isError: errorFetchingFlow } = useFlow('aal2')
    const ref = useRef(null)

    useEffect(() => {
        if (isError) {
            ref.current.value = ''
            ref.current.focus()
        }
    }, [isError])

    return (
        <>
            <div className="body" style={row1Style}>
                Enter your authenticator code
            </div>
            <div style={row2Style}>
                <JiggleMotionDiv jiggle={isError}>
                    <PlainTextInput ref={ref} name="totp_code" placeholder='Code...' required />
                </JiggleMotionDiv>
                {errorFetchingFlow && <ErrorFetchingFlow />}
            </div>
            {flow && <HiddenInputs flow={flow} />}
        </>
    )
}

const ReAuthModal = withSmallModal((props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: user } = useGetMeQuery()
    const [needsAal2, setNeedsAal2] = useState(false)
    const [completeFlow, {
        isLoading: submittingFlow,
        isSuccess: completedFlow
    }] = useCompleteLoginFlowMutation(
        { fixedCacheKey: searchParams.get('flow') }
    )
    const dispatch = useDispatch()

    // Close modal after 9 minute timeout
    // to avoid submitting expired flows
    useEffect(() => {
        const timeout = setTimeout(() => {
            props.setVisible(false)
        }, 60 * 9 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    // Handle successful flow completion
    useEffect(() => {
        const aal = searchParams.get('aal')
        const finishedCase1 = completedFlow && !user.authenticator_enabled
        const finishedCase2 = completedFlow && aal === 'aal2'
        const needsAal2 = completedFlow && user.authenticator_enabled && aal === 'aal1'

        if (finishedCase1 || finishedCase2) {
            dispatch({ type: 'user/resetAuthedAt' })
            setSearchParams({}) // Clear search params
        } else if (needsAal2) {
            setNeedsAal2(true)
        }
    }, [completedFlow, submittingFlow])

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        completeFlow({
            data: Object.fromEntries(data),
            params: { flow: searchParams.get('flow') }
        })
    }

    return (
        <div>
            <h3>Confirm Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <AnimatePresence mode="wait">
                        {needsAal2
                            ?
                            <SlideMotionDiv key='aal2' last>
                                <Totp />
                            </SlideMotionDiv>
                            :
                            <SlideMotionDiv key='aal1' first>
                                <PassWord />
                            </SlideMotionDiv>
                        }
                    </AnimatePresence >
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SecondaryButton onClick={() => props.setVisible(false)}>
                        Cancel
                    </SecondaryButton>
                    <GreenSubmitWithArrow submitting={submittingFlow} stroke={'var(--m-text-gray)'}>
                        Continue
                    </GreenSubmitWithArrow>
                </div>
            </form>
        </div>
    )
})

// This HOC is used to wrap a component that requires the user
// to re-authenticate

// In order to get a settings flow and update settings, a user
// needs a recent seesion that is newer than the max age in the
// ory settings.

export default function withReAuth(Component) {

    return (props) => {
        const [continueToComponent, setContinueToComponent] = useState(false)
        const sessionIsFresh = useSelector(selectSessionIsFresh)

        useEffect(() => {
            sessionIsFresh && setContinueToComponent(true)
        }, [sessionIsFresh])

        // Timeout for the target component to be closed
        // after 7 minutes since the session obtained by
        // the reauth needs to be fresh. If the user sits
        // around too long during the reauth, the session
        // wont be fresh enough
        useEffect(() => {
            const timeout = setTimeout(() => {
                props.onClose && props.onClose()
            }, 60 * 9 * 1000)
            return () => clearTimeout(timeout)
        }, [])

        return (
            <>
                {continueToComponent
                    ?
                    <Component {...props} />
                    :
                    <ReAuthModal
                        onClose={() => { props.onClose && props.onClose() }}
                        blur={1}
                    />
                }
            </>
        )
    }
}
