import { useEffect, useState } from 'react'

import './ReAuth.css'
import { useSearchParams, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'

import { withSmallModal } from '@ledget/ui'
import { useGetMeQuery } from '@features/userSlice'
import { useCreateOtpMutation, useVerifyOtpMutation, selectSessionIsFreshAal1 } from '@features/authSlice'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory-sdk'
import {
    BlueSubmitWithArrow,
    SecondaryButton,
    PasswordInput,
    PlainTextInput,
    FormError,
    SlideMotionDiv,
    JiggleDiv,
    TotpAppGraphic,
    SmsVerifyStatus,
    RecoveryCodeGraphic,
    Otc,
    BackButton,
    LightGrnWideButton,
    useLoaded
} from '@ledget/ui'

const ErrorFetchingFlow = () => (<FormError msg={"Something went wrong, please try again later."} />)

const PassWord = ({ onCancel }) => {
    const location = useLocation()
    const { data: user } = useGetMeQuery()
    const dispatch = useDispatch()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )
    const sessionIsFreshAal1 = useSelector(selectSessionIsFreshAal1)

    const {
        isGettingFlow,
        isGetFlowError,
        isCompleteError,
        isCompletingFlow,
        isCompleteSuccess
    } = flowStatus

    useEffect(() => {
        if (!sessionIsFreshAal1) {
            fetchFlow({ aal: 'aal1', refresh: true })
        }
    }, [])

    useEffect(() => {
        if (isCompleteSuccess) {
            dispatch({ type: 'auth/aal1ReAuthed' })
        }
    }, [isCompleteSuccess])

    return (
        <form onSubmit={submit} className="reauth-form">
            <div>
                {['setup', 'change', 'delete'].some((word) => location.pathname.includes(word))
                    ? 'To make this change, first confirm your login'
                    : 'First confirm your login'
                }
            </div>
            <div>
                <JiggleDiv jiggle={isCompleteError}>
                    <PasswordInput loading={isGettingFlow} required autoFocus />
                </JiggleDiv>
                {isGetFlowError && <ErrorFetchingFlow />}
            </div>
            <div>
                <SecondaryButton
                    type="button"
                    onClick={() => onCancel()}
                >
                    Cancel
                </SecondaryButton>
                <BlueSubmitWithArrow
                    submitting={isCompletingFlow}
                    name="method"
                    value="password"
                >
                    Continue
                </BlueSubmitWithArrow>
            </div>
            <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
            <input type="hidden" name="identifier" value={user?.email || ''} />
        </form>
    )
}

const Totp = () => {
    const dispatch = useDispatch()
    const [useLookupSecret, setUseLookupSecret] = useState(false)
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )

    const {
        isGettingFlow,
        isGetFlowError,
        isCompleteError,
        isCompletingFlow,
        isCompleteSuccess
    } = flowStatus

    useEffect(() => {
        fetchFlow({ aal: 'aal2', refresh: true })
    }, [])

    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            timeout = setTimeout(() => {
                dispatch({ type: 'auth/aal2ReAuthed' })
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    return (
        <form onSubmit={submit} className="reauth-form">
            <div>
                <h3>
                    {useLookupSecret ? 'Enter one of your recovery codes' : 'Enter your authenticator code'}
                </h3>
                {useLookupSecret
                    ?
                    <BackButton
                        onClick={() => { setUseLookupSecret(false) }}
                    />
                    :
                    <div className="recovery-code-option--container">
                        <span>or use a&nbsp;&nbsp;</span>
                        <button
                            onClick={() => { setUseLookupSecret(true) }}
                            aria-label="Use recovery code"
                        >
                            recovery code
                        </button>
                    </div>
                }

            </div>
            <div>
                <div className="graphic">
                    {useLookupSecret
                        ? <RecoveryCodeGraphic finished={isCompleteSuccess} />
                        : <TotpAppGraphic finished={isCompleteSuccess} />
                    }
                </div>
                <JiggleDiv jiggle={isCompleteError}>
                    <PlainTextInput
                        loading={isGettingFlow}
                        name={`${useLookupSecret ? 'lookup_secret' : 'totp_code'}`}
                        placeholder='Code'
                        autoFocus
                        required
                    />
                </JiggleDiv>
                {isGetFlowError && <ErrorFetchingFlow />}
            </div>
            <div>
                <BlueSubmitWithArrow
                    submitting={isCompletingFlow}
                    name="method"
                    value={`${useLookupSecret ? 'lookup_secret' : 'totp'}`}
                >
                    Confirm
                </BlueSubmitWithArrow>
            </div>
            <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
        </form>
    )
}

const Otp = () => {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: user } = useGetMeQuery()
    const [createOtp, { data: otp, isLoading: creatingOtp, isSuccess: createdOtp, isError: isCreateOtpError }] = useCreateOtpMutation()
    const [verifyOtp, { isSuccess: otpVerified, isLoading: verifyingOtp, isError: isOtpVerifyError }] = useVerifyOtpMutation()

    useEffect(() => {
        createOtp({ data: user.phone_number })
    }, [])

    useEffect(() => {
        searchParams.set('id', otp?.id)
        setSearchParams(searchParams)
    }, [createdOtp])

    useEffect(() => {
        let timeout
        if (otpVerified) {
            timeout = setTimeout(() => {
                dispatch({ type: 'auth/aal15ReAuthed' })
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [otpVerified])

    const handleSubmit = (e) => {
        const data = Object.fromEntries(new FormData(e.target))
        verifyOtp({
            data: { 'code': data.code },
            id: searchParams.get('id')
        })
    }

    return (
        <form onSubmit={handleSubmit} className="reauth-form">
            <div>
                <h4>Enter the code sent to your phone</h4>
            </div>
            <div>
                <div className="graphic">
                    <SmsVerifyStatus finished={otpVerified} />
                </div>
                <JiggleDiv jiggle={isOtpVerifyError}>
                    <Otc colorful={false} />
                </JiggleDiv>
                {isCreateOtpError && <ErrorFetchingFlow />}
            </div>
            <div>
                <LightGrnWideButton
                    loading={creatingOtp}
                    submitting={verifyingOtp}
                >
                    Confirm
                </LightGrnWideButton>
            </div>
        </form>
    )
}

const ReAuthModals = withSmallModal((props) => {
    const [searchParams] = useSearchParams()
    const loaded = useLoaded(100)

    return (
        <AnimatePresence mode="wait">
            {(!searchParams.get('aal') || searchParams.get('aal') === 'aal1')
                &&
                <SlideMotionDiv
                    key='aal1'
                    position={loaded ? 'first' : 'fixed'}
                >
                    <PassWord onCancel={() => props.closeModal()} />
                </SlideMotionDiv>
            }
            {searchParams.get('aal') === 'aal2' &&
                <SlideMotionDiv
                    key='aal2'
                    position={'last'}
                >
                    <Totp />
                </SlideMotionDiv>
            }
            {searchParams.get('aal') === 'aal15' &&
                <SlideMotionDiv
                    key='aal15'
                    position={'last'}
                >
                    <Otp />
                </SlideMotionDiv>
            }
        </AnimatePresence >
    )
})

// This HOC is used to wrap a component that requires the user
// to re-authenticate

// In order to get a settings flow and update settings, a user
// needs a recent seesion that is newer than the max age in the
// ory settings.

export default function withReAuth(Component) {

    return (props) => {
        const { data: user } = useGetMeQuery()
        const [searchParams, setSearchParams] = useSearchParams()
        const [continueToComponent, setContinueToComponent] = useState(false)
        const reAuthed = useSelector(state => state.auth.reAuthed)
        const { requiredAal } = props

        // Controller for checking if the user has reached the required
        // authentication level. It reacts to changes in the reAuthed
        // object in the redux store
        useEffect(() => {
            const sessionIsFresh = Date.now() - reAuthed.at < 1000 * 60 * 9
            const aalGood = reAuthed.level === (requiredAal ?? user.highest_aal)
            let interval

            // If requirements are met, start the poller to check freshness
            // We use a poller since the modal might be opened and closed multiple times
            if (sessionIsFresh && aalGood) {

                setContinueToComponent(true)
                if (searchParams.get('aal')) {
                    searchParams.delete('flow')
                }
                searchParams.delete('aal')
                setSearchParams(searchParams)

                interval = setInterval(() => {
                    const isFreshCheck = Date.now() - reAuthed.at < 1000 * 60 * 9
                    !isFreshCheck && props.onClose()
                }, [1000])

            } else if (sessionIsFresh && !aalGood) {
                // Needs to increase aal
                const neededAal = requiredAal ?? user.highest_aal
                if (neededAal === 'aal2') {
                    searchParams.set('aal', 'aal2')
                    setSearchParams(searchParams)
                } else {
                    setSearchParams({ aal: 'aal15' })
                }
            }

            return () => clearInterval(interval)
        }, [reAuthed.at])

        return (
            <>
                <ReAuthModals
                    hideAll={continueToComponent}
                    onClose={() => !continueToComponent && props.onClose()}
                    hasOverlay={false}
                    blur={1}
                    zIndex={300}
                />
                <Component
                    {...props}
                    hideModal={!continueToComponent}
                    zIndex={200}
                />
            </>
        )
    }
}
