import React, { useEffect, useState, useRef } from 'react'

import { useSearchParams, useLocation } from 'react-router-dom'
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
    JiggleDiv,
    TotpAppGraphic
} from '@ledget/shared-ui'
import { useFlow } from '@ledget/ory-sdk'


const row1Style = { marginTop: '20px', fontWeight: '500', marginLeft: '2px' }
const row2Style = { margin: '16px 0 28px 0' }

const ErrorFetchingFlow = () => (<FormError msg={"Something went wrong, please try again later."} />)

const PassWord = ({ isGettingFlow, isCompleteError }) => {
    const location = useLocation()
    const pwdRef = useRef(null)

    // Focus password input on error
    useEffect(() => {
        isCompleteError && pwdRef.current?.focus()
    }, [isCompleteError])

    return (
        <>
            <div className="body" style={row1Style}>
                {['setup', 'change', 'delete'].some((word) => location.pathname.includes(word))
                    ? 'To make this change, first confirm your login'
                    : 'First confirm your login'
                }
            </div>
            <div style={row2Style}>
                <JiggleDiv jiggle={isCompleteError}>
                    <PasswordInput ref={pwdRef} loading={isGettingFlow} required />
                </JiggleDiv>
            </div>
        </>
    )
}

const Totp = ({ isGettingFlow, isCompleteError, totpSuccess, errMsg }) => {
    const ref = useRef(null)
    const [finished, setFinished] = useState(false)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (isCompleteError) {
            ref.current.value = ''
            ref.current.focus()
        }
    }, [isCompleteError])

    useEffect(() => {
        if (totpSuccess && searchParams.get('aal') === 'aal2') {
            setFinished(true)
        }
    }, [totpSuccess])

    return (
        <>
            <div style={{ margin: '4px' }}>
                Enter your authenticator code
            </div>
            <div style={{ margin: '24px' }}>
                <TotpAppGraphic finished={finished} />
            </div>
            <div style={row2Style}>
                <JiggleDiv jiggle={isCompleteError}>
                    <PlainTextInput
                        ref={ref}
                        loading={isGettingFlow}
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
    const [searchParams, setSearchParams] = useSearchParams()

    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )
    const { data: user } = useGetMeQuery()

    const dispatch = useDispatch()
    const sessionIsFresh = useSelector(selectSessionIsFresh)

    const {
        isGettingFlow,
        errorFetchingFlow,
        isCompleteError,
        isCompleteSuccess,
        isCompletingFlow,
        errMsg
    } = flowStatus

    // Fetch Flow on mount, only fetch if session is stale
    // If the session is fresh, then the user will already
    // have reached the target component
    useEffect(() => {
        if (!sessionIsFresh) {
            fetchFlow({ aal: 'aal1', refresh: true })
        }
    }, [])

    // Handle Successful Flow Completion
    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            const aal = searchParams.get('aal')
            const finishedCase1 = !user.mfa_method && aal === 'aal1'
            const finishedCase2 = user.mfa_method && aal === 'aal2'

            if (finishedCase2) {
                timeout = setTimeout(() => {
                    dispatch({ type: 'user/resetAuthedAt' })
                    setSearchParams({})
                    props.closeModal()
                }, 1000)
            } else if (finishedCase1) {
                dispatch({ type: 'user/resetAuthedAt' })
                setSearchParams({})
                props.closeModal()
            } else if (aal === 'aal1') {
                fetchFlow({ aal: 'aal2', refresh: true })
            }
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    return (
        <form onSubmit={submit}>
            <h3>Confirm Login</h3>
            <AnimatePresence mode="wait">
                {searchParams.get('aal') === 'aal2'
                    ?
                    <SlideMotionDiv
                        key='aal2'
                        first={false}
                        last={!isCompleteSuccess}
                    >
                        <Totp
                            isGettingFlow={isGettingFlow}
                            isCompleteError={isCompleteError}
                            totpSuccess={isCompleteSuccess}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv key='aal1' first={Boolean(flow)}>
                        <PassWord
                            isGettingFlow={isGettingFlow}
                            isCompleteError={isCompleteError}
                        />
                    </SlideMotionDiv>
                }
            </AnimatePresence >
            {errorFetchingFlow && <ErrorFetchingFlow />}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SecondaryButton onClick={() => props.closeModal()}>
                    Cancel
                </SecondaryButton>
                <GreenSubmitWithArrow
                    submitting={isCompletingFlow}
                    name="method"
                    value={searchParams.get('aal') === 'aal2' ? 'totp' : 'password'}
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
        const reAuthedAt = useSelector((state) => state.user.reAuthedAt)

        // Continue to modal if session is fresh,
        // if it's stale, the user will be shown
        // the reauth prompts
        useEffect(() => {
            const sessionIsFresh = Date.now() - reAuthedAt < 1000 * 60 * 9
            let interval

            if (sessionIsFresh) {
                setContinueToComponent(true)
                interval = setInterval(() => {
                    const isFreshCheck = Date.now() - reAuthedAt < 1000 * 60 * 9
                    !isFreshCheck && props.onClose()
                }, [1000])
            }

            return () => clearInterval(interval)
        }, [reAuthedAt])

        return (
            <>
                <Component
                    {...props}
                    hideModal={!continueToComponent}
                />
                <ReAuthModal
                    hideAll={continueToComponent}
                    hasOverlay={props.reAuthOverlay ?? false}
                    blur={1}
                />
            </>
        )
    }
}
