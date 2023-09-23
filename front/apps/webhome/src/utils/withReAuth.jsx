import React, { useEffect, useState, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import { useFlow } from '@ledget/ory-sdk'

const row1Style = { marginTop: '20px', fontWeight: '500', marginLeft: '2px' }
const row2Style = { margin: '16px 0 28px 0' }

const ErrorFetchingFlow = () => (<FormError msg={"Something went wrong, please try again later."} />)

const PassWord = ({ isFetchingFlow, isCompleteError }) => {
    const pwdRef = useRef(null)

    // Focus password input on error
    useEffect(() => {
        isCompleteError && pwdRef.current?.focus()
    }, [isCompleteError])

    return (
        <>
            <div className="body" style={row1Style}>
                To make this change, first confirm your login
            </div>
            <div style={row2Style}>
                <JiggleDiv jiggle={isCompleteError}>
                    <PasswordInput ref={pwdRef} loading={isFetchingFlow} required />
                </JiggleDiv>
            </div>
        </>
    )
}

const Totp = ({ isFetchingFlow, isCompleteError, errMsg }) => {
    const ref = useRef(null)
    useEffect(() => {
        if (isCompleteError) {
            ref.current.value = ''
            ref.current.focus()
        }
    }, [isCompleteError])

    return (
        <>
            <div className="body" style={row1Style}>
                Enter your authenticator code
            </div>
            <div style={row2Style}>
                <JiggleDiv jiggle={isCompleteError}>
                    <PlainTextInput
                        ref={ref}
                        loading={isFetchingFlow}
                        name="totp_code"
                        placeholder='Code'
                        required
                    />
                </JiggleDiv>
                {errMsg && <ErrorFetchingFlow />}
            </div>
        </>
    )
}

const ReAuthModal = withSmallModal((props) => {
    const [searchParams] = useSearchParams()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )
    const [, setSearchParams] = useSearchParams()
    const { data: user } = useGetMeQuery()
    const dispatch = useDispatch()
    const [needsAal2, setNeedsAal2] = useState(false)

    const {
        isFetchingFlow,
        errorFetchingFlow,
        isCompleteError,
        isCompleteSuccess,
        submittingFlow,
        errMsg
    } = flowStatus

    // Fetch Flow on mount
    useEffect(() => {
        fetchFlow({ aal: 'aal1', refresh: true })
    }, [])

    // Handle Successful Flow Completion
    useEffect(() => {
        if (isCompleteSuccess) {
            const aal = searchParams.get('aal')
            const finishedCase1 = !user.mfa_method && aal === 'aal1'
            const finishedCase2 = user.mfa_method && aal === 'aal2'

            if (finishedCase1 || finishedCase2) {
                dispatch({ type: 'user/resetAuthedAt' })
                setSearchParams({})
            } else if (aal === 'aal1') {
                fetchFlow({ aal: 'aal2', refresh: true })
                setNeedsAal2(true)
            }
        }
    }, [isCompleteSuccess])

    // Close modal after 9 minute timeout
    // to avoid submitting expired flows
    useEffect(() => {
        const timeout = setTimeout(() => {
            props.setVisible(false)
        }, 60 * 9 * 1000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <form onSubmit={submit}>
            <h3>Confirm Login</h3>
            <AnimatePresence mode="wait">
                {needsAal2
                    ?
                    <SlideMotionDiv key='aal2' last>
                        <Totp
                            isFetchingFlow={isFetchingFlow}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv key='aal1' first={Boolean(flow)}>
                        <PassWord
                            isFetchingFlow={isFetchingFlow}
                            isCompleteError={isCompleteError}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence >
            {errorFetchingFlow && <ErrorFetchingFlow />}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SecondaryButton onClick={() => props.setVisible(false)}>
                    Cancel
                </SecondaryButton>
                <GreenSubmitWithArrow
                    submitting={submittingFlow}
                    name="method"
                    value={needsAal2 ? 'totp' : 'password'}
                >
                    Continue
                </GreenSubmitWithArrow>
            </div>
            <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
            <input type="hidden" name="identifier" value={user?.email || ''} />
        </form>
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
            setContinueToComponent(sessionIsFresh)
        }, [sessionIsFresh])

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
