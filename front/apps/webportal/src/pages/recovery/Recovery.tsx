import { useEffect, useState } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"

import './Recovery.scss'
import { ledgetapi } from "@api/index"
import {
    SlideMotionDiv,
    PortalWindow,
    WindowLoadingBar
} from '@ledget/ui'
import { useLazyGetRecoveryFlowQuery, useCompleteRecoveryFlowMutation } from '@features/orySlice'
import { useFlow } from '@ledget/ory'
import RecoveryForm from './RecoveryForm'
import RecoveryVerificationForm from './VerificationForm'


const RecoverAccount = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [codeSuccess, setCodeSuccess] = useState(false)
    const navigate = useNavigate()

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
        let timeout: NodeJS.Timeout
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
                            navigate(`/login?aal=aal2&mfa=${err.response.data.error}`)
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
                            errMsg={errMsg?.[0]}
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
                            errMsg={errMsg?.[0]}
                        />
                    </SlideMotionDiv>
                )
        }
    }

    return (
        <div>
            <PortalWindow>
                <WindowLoadingBar visible={isGettingFlow || isCompletingFlow} />
                <AnimatePresence mode="wait">
                    {renderPage()}
                </AnimatePresence>
            </PortalWindow>
        </div>
    )
}

export default RecoverAccount
