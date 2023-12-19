import { useEffect, useState } from 'react'

import './ReAuth.css'
import { useSearchParams, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { withSmallModal } from '@ledget/ui'
import { useGetMeQuery, User } from '@features/userSlice'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import {
    useCreateOtpMutation,
    useVerifyOtpMutation,
    selectSessionIsFreshAal1,
    aal1ReAuthed,
    aal15ReAuthed,
    aal2ReAuthed
} from '@features/authSlice'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory'
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

const PassWord = ({ onCancel }: { onCancel: () => void }) => {
    const location = useLocation()
    const { data: user } = useGetMeQuery()
    const dispatch = useAppDispatch()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetLoginFlowQuery,
        useCompleteLoginFlowMutation,
        'login'
    )
    const sessionIsFreshAal1 = useAppSelector(selectSessionIsFreshAal1)

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
            dispatch({ type: aal1ReAuthed })
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
                    <PasswordInput loading={isGettingFlow} required={true} autoFocus={true} />
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
    const dispatch = useAppDispatch()
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
        let timeout: NodeJS.Timeout
        if (isCompleteSuccess) {
            timeout = setTimeout(() => {
                dispatch({ type: aal2ReAuthed })
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
                        autoFocus={true}
                        required={true}
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
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const { data: user } = useGetMeQuery()
    const [createOtp, { data: otp, isLoading: creatingOtp, isSuccess: createdOtp, isError: isCreateOtpError }] = useCreateOtpMutation()
    const [verifyOtp, { isSuccess: otpVerified, isLoading: verifyingOtp, isError: isOtpVerifyError }] = useVerifyOtpMutation()

    useEffect(() => {
        user && createOtp({ phone: user.phone_number || undefined })
    }, [])

    useEffect(() => {
        if (otp?.id) {
            searchParams.set('id', otp.id)
            setSearchParams(searchParams)
        }
    }, [createdOtp])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (otpVerified) {
            timeout = setTimeout(() => {
                dispatch({ type: aal15ReAuthed })
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [otpVerified])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const data = Object.fromEntries(new FormData(e.target as any) as any)
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

export const ReAuthModal = withSmallModal((props) => {
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

interface WithReAuthI {
    hideModal?: boolean,
    requiredAal: User['highest_aal']
    onClose?: () => void
}

const useReauthCheck = ({ requiredAal, onClose }: Pick<WithReAuthI, 'requiredAal' | 'onClose'>) => {
    const { data: user } = useGetMeQuery()
    const [searchParams, setSearchParams] = useSearchParams()
    const reAuthed = useAppSelector(state => state.auth.reAuthed)
    const [continueToComponent, setContinueToComponent] = useState(false)

    // Controller for checking if the user has reached the required
    // authentication level. It reacts to changes in the reAuthed
    // object in the redux store
    useEffect(() => {
        const sessionIsFresh = Date.now() - (reAuthed.at || 0) < 1000 * 60 * 9
        const aalGood = reAuthed.level === (requiredAal ?? user?.highest_aal)
        let interval: NodeJS.Timeout

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
                const isFreshCheck = Date.now() - (reAuthed.at || 0) < 1000 * 60 * 9
                !isFreshCheck && onClose && onClose()
            }, 1000 * 60 * 9)

        } else if (sessionIsFresh && !aalGood) {
            // Needs to increase aal
            const neededAal = (requiredAal ?? user?.highest_aal) || ''
            if (neededAal === 'aal2') {
                searchParams.set('aal', 'aal2')
                setSearchParams(searchParams)
            } else {
                setSearchParams({ aal: 'aal15' })
            }
        }

        return () => clearInterval(interval)
    }, [reAuthed.at])

    return continueToComponent
}

export const ReAuthProtected = ({ children, requiredAal, onReAuth }: {
    children: React.FC<{ reAuth: () => void, current: boolean }>,
    onReAuth: (...args: any) => void,
    requiredAal?: User['highest_aal']
}) => {

    const [showReAuthModal, setShowReAuthModal] = useState(false)
    const [isReAuthing, setIsReAuthing] = useState(false)
    const [current, setCurrent] = useState(false)

    const { data: user } = useGetMeQuery()
    const isReAuthed = useReauthCheck({ requiredAal: requiredAal || user?.highest_aal || 'aal1', onClose: () => { setShowReAuthModal(false) } })

    // When the user successfully re-auths, close the modal and
    // run the onReAuth function
    useEffect(() => {
        if (isReAuthed && showReAuthModal) {
            onReAuth()
            setShowReAuthModal(false)
        }
    }, [isReAuthed])

    // When the user initiates whatever action requires a re-auth,
    // first check to see if they are already authed recently. If not,
    // show the reauth modal form
    useEffect(() => {
        if (isReAuthed && isReAuthing) {
            onReAuth()
        } else if (isReAuthing) {
            setShowReAuthModal(true)
        }
    }, [isReAuthing])

    return (
        <>
            {showReAuthModal &&
                <ReAuthModal onClose={() => setShowReAuthModal(false)} />}
            {children({
                reAuth: () => {
                    setIsReAuthing(true)
                    setCurrent(true)
                }, current
            })}
        </>
    )
}

export function withReAuth<P>(Component: React.FC<P & Partial<WithReAuthI>>) {

    return (props: (Partial<WithReAuthI> & P)) => {
        const [searchParams, setSearchParams] = useSearchParams()
        const { data: user } = useGetMeQuery()
        const continueToComponent = useReauthCheck({
            requiredAal: props.requiredAal || user?.highest_aal || 'aal1',
            onClose: () => { props.onClose && props.onClose() }
        })

        return (
            <>
                <ReAuthModal
                    hideAll={continueToComponent}
                    onClose={() => {
                        searchParams.delete('aal')
                        searchParams.delete('flow')
                        setSearchParams(searchParams)
                        if (props.onClose) {
                            props.onClose()
                        }
                    }}
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

export default withReAuth
