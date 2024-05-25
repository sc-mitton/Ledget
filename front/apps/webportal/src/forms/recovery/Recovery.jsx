import { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"

import './Recovery.scss'
import { WindowLoadingBar } from '@pieces'
import { ledgetapi } from "@api"
import {
    FormError,
    MainButton,
    SlideMotionDiv,
    PlainTextInput,
    BackButton,
    StatusPulse,
    Otc,
    useColorScheme
} from '@ledget/ui'
import { Key } from '@ledget/media'
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory'

const Error = ({ msg }) => (
    <div className="recovery-error--container">
        {msg
            ?
            <FormError msg={errMsg} />
            :
            <FormError msg={"Something went wrong, please try again later."} />
        }
    </div>
)

const MainGraphic = ({ unLocked }) => {
    const { isDark } = useColorScheme()

    return (
        <div
            className={`${(unLocked) ? 'unlocked' : 'locked'}`}
            id="image-container"
        >
            <Key dark={isDark} />
            <StatusPulse positive={unLocked} size="medium" />
        </div>
    )
}

const RecoveryForm = ({ flow, submit, isCompleteError, errMsg }) => {
    const navigate = useNavigate()

    return (
        <>
            <div>
                <div style={{ margin: '0 0 .5em -.25em' }}>
                    <BackButton
                        onClick={() => { navigate('/login') }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Forgot password?</h2>
                <div style={{ margin: '.5em 0' }}>
                    <span>
                        Enter the email connected to your account and we'll
                        send you a recovery code.
                    </span>
                </div>
                {(isCompleteError || errMsg) && <Error msg={errMsg} />}
            </div>
            <MainGraphic />
            <form
                onSubmit={submit}
                className="recovery-form"
                id='send-recovery-code-form'
            >
                <PlainTextInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    name="email"
                    autoFocus
                    required
                />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <MainButton
                    name='method'
                    type="submit"
                    value="code"
                >
                    Send code
                </MainButton>
            </form>
        </>
    )
}

const RecoveryVerificationForm = ({ submit, flow, codeSuccess, isCompleteError, errMsg }) => {
    const [searchParams, setsearchParams] = useSearchParams()
    const [csrfToken, setCsrfToken] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(e)
    }

    useEffect(() => {
        if (flow) {
            flow.ui.nodes.find((n) => {
                n.attributes.name === 'csrf_token'
                    && (setCsrfToken(n.attributes.value))
            })
        }
    }, [flow])

    return (
        <>
            <div>
                <div style={{ margin: '0 0 .5em -.25em' }}>
                    <BackButton
                        onClick={() => {
                            searchParams.delete('step')
                            setsearchParams(searchParams)
                        }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Recovery Code</h2>
                <div style={{ margin: '.25em 0' }}>
                    <span>Enter the code sent to your email </span>
                </div>
                {(isCompleteError || errMsg) && <Error msg={errMsg} />}
            </div>
            <MainGraphic unLocked={codeSuccess} />
            <form
                id="recovery-verification-form"
                className="recovery-form"
                onSubmit={handleSubmit}
            >
                <Otc codeLength={6} />
                <input type="hidden" name="csrf_token" value={csrfToken} />
                <div className="verification-button-container">
                    <MainButton name="method" type="submit" value="code">
                        Verify Code
                    </MainButton>
                </div>
            </form>
        </>
    )
}

const RecoverAccount = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [codeSuccess, setCodeSuccess] = useState(false)

    const {
        flow,
        fetchFlow,
        submit,
        flowStatus,
        result
    } = useFlow(
        useLazyGetRecoveryFlowQuery,
        useCompleteRecoveryFlowMutation,
        'recovery'
    )

    const {
        isGettingFlow,
        isCompleteSuccess,
        isCompletingFlow,
        isCompleteError,
        completeError,
        errMsg
    } = flowStatus

    useEffect(() => {
        // If 422 error, redirect to login
        let timeout
        if (completeError?.status === 422) {

            ledgetapi.post('/devices')
                .then((res) => {

                    setCodeSuccess(true)
                    timeout = setTimeout(() => {
                        window.location.href = import.meta.env.VITE_RECOVERY_REDIRECT
                    }, 1200)

                }).catch((err) => {

                    if (err.response.status === 422) {
                        setCodeSuccess(true)
                        timeout = setTimeout(() => {
                            navigate({
                                pathname: '/login',
                                query: {
                                    aal: 'aal2',
                                    mfa: err.response.data.error
                                }
                            })
                        }, 1200)
                    } else {
                        console.warn(err)
                    }

                })
        }
        return () => clearTimeout(timeout)
    }, [completeError])

    useEffect(() => {
        if (searchParams.get('step') !== 'verify' && isCompleteSuccess) {
            searchParams.set('step', 'verify')
            setSearchParams(searchParams)
        }
    }, [isCompleteSuccess])

    useEffect(() => { fetchFlow() }, [])

    const renderPage = () => {
        switch (searchParams.get('step')) {
            case 'verify':
                return (
                    <SlideMotionDiv
                        className="recovery-form"
                        id="recovery-verification-form-container"
                        key="recovery-verification-form-container"
                        position={'last'}
                    >
                        <RecoveryVerificationForm
                            flow={result}
                            submit={submit}
                            codeSuccess={codeSuccess}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                )
            default:
            case 'code':
                return (
                    <SlideMotionDiv
                        id="recovery-code-form-container"
                        key="recovery-code-form-container"
                        position={flow ? 'first' : 'fixed'}
                    >
                        <RecoveryForm
                            flow={flow}
                            submit={submit}
                            isCompleteError={isCompleteError}
                            errMsg={errMsg}
                        />
                    </SlideMotionDiv>
                )
        }
    }

    return (
        <div id='recovery-window' className='portal-window'>
            <WindowLoadingBar visible={isGettingFlow || isCompletingFlow} />
            <AnimatePresence mode="wait">
                {renderPage()}
            </AnimatePresence>
        </div>
    )
}

export default RecoverAccount
