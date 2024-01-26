import { useEffect, useState } from 'react'

import './ReAuth.css'
import { useSearchParams, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { BlueSubmitButton, withSmallModal } from '@ledget/ui'
import { useGetMeQuery, User } from '@features/userSlice'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import {
    selectSessionIsFreshAal1,
    aal1ReAuthed,
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
    RecoveryCodeGraphic,
    BackButton,
    useLoaded,
    BlueTextButton
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
        if (!sessionIsFreshAal1)
            fetchFlow({ aal: 'aal1', refresh: true })
    }, [])

    useEffect(() => {
        if (isCompleteSuccess)
            dispatch({ type: aal1ReAuthed })
    }, [isCompleteSuccess])

    return (
        <form onSubmit={submit} className="reauth-form">
            <div>
                {['setup', 'change', 'delete'].some((word) => location.pathname.includes(word))
                    ? 'Confirm your password to make this change'
                    : 'Confirm your password'
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

    useEffect(() => { fetchFlow({ aal: 'aal2', refresh: true }) }, [])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (isCompleteSuccess) {
            timeout = setTimeout(() => {
                dispatch({ type: aal2ReAuthed })
            }, 1200)
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
                    <BackButton onClick={() => { setUseLookupSecret(false) }} type="button" />
                    :
                    <div className="recovery-code-option--container">
                        <span>or use a&nbsp;&nbsp;</span>
                        <BlueTextButton
                            type="button"
                            onClick={() => { setUseLookupSecret(true) }}
                            aria-label="Use recovery code"
                        >
                            recovery code
                        </BlueTextButton>
                    </div>
                }

            </div>
            <div>
                <div className="graphic">
                    {useLookupSecret
                        ? <RecoveryCodeGraphic finished={isCompleteSuccess} />
                        : <TotpAppGraphic finished={isCompleteSuccess} />}
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
                <BlueSubmitButton
                    submitting={isCompletingFlow}
                    name="method"
                    value={`${useLookupSecret ? 'lookup_secret' : 'totp'}`}
                >
                    Confirm
                </BlueSubmitButton>
            </div>
            <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
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

const useReauthCheck = ({ requiredAal, onClose }: Pick<WithReAuthI, 'requiredAal'> & { onClose?: () => void }) => {
    const { data: user } = useGetMeQuery()
    const [searchParams, setSearchParams] = useSearchParams()
    const reAuthed = useAppSelector(state => state.auth.reAuthed)
    const [continueToComponent, setContinueToComponent] = useState(
        (Date.now() - (reAuthed.at || 0) < 1000 * 60 * 9) && reAuthed.level === (requiredAal ?? user?.highest_aal)
    )

    // Controller for checking if the user has reached the required
    // authentication level. It reacts to changes in the reAuthed
    // object in the redux store
    useEffect(() => {
        const sessionIsFresh = Date.now() - (reAuthed.at || 0) < 1000 * 60 * 9
        const aalGood = (user?.highest_aal === 'aal1' || requiredAal === 'aal1') ? Boolean(reAuthed.level) : user?.highest_aal === reAuthed.level
        let interval: NodeJS.Timeout

        // If requirements are met, start the poller to check freshness
        // We use a poller since the modal might be opened and closed multiple times
        if (sessionIsFresh && aalGood) {

            searchParams.delete('flow')
            searchParams.delete('aal')
            setSearchParams(searchParams)
            setContinueToComponent(true)

            interval = setInterval(() => {
                const isFreshCheck = Date.now() - (reAuthed.at || 0) < 1000 * 60 * 9
                !isFreshCheck && onClose && onClose()
            }, 1000 * 60 * 9)

        } else if (sessionIsFresh && !aalGood) {
            // Needs to increase aal
            const neededAal = (requiredAal ?? user?.highest_aal) || ''

            if (neededAal === 'aal2') {
                searchParams.set('aal', 'aal2')
                searchParams.delete('flow')
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
    const [, setSearchParams] = useSearchParams()

    const { data: user } = useGetMeQuery()
    // onClose callback not necessary since the protected action is executed immediately
    const isReAuthed = useReauthCheck({ requiredAal: requiredAal || user?.highest_aal || 'aal1' })

    // When the user initiates whatever action requires a re-auth,
    // first check to see if they are already authed recently. If not,
    // show the reauth modal form
    useEffect(() => {
        if (isReAuthing) {
            if (!isReAuthed) {
                setShowReAuthModal(true)
            } else {
                onReAuth()
            }
        }
    }, [isReAuthing])

    // Once the user has re-authed, execute the onReauth, and clean up
    useEffect(() => {
        if (isReAuthed) {
            onReAuth()
            setIsReAuthing(false)
            setShowReAuthModal(false)
        }
    }, [isReAuthed])

    return (
        <>
            {showReAuthModal &&
                <ReAuthModal onClose={() => {
                    setSearchParams({})
                    setIsReAuthing(false)
                    setShowReAuthModal(false)
                }} />}
            {children({
                reAuth: () => {
                    setIsReAuthing(true)
                    setCurrent(true)
                },
                current
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
                        if (!continueToComponent && props.onClose) {
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
