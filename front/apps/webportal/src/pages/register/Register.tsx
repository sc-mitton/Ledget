import { useEffect, useState } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import ledgetapi from '@api/axios'
import { PasskeyInfoModal } from '@modals/index'
import {
    SlideMotionDiv,
    PortalWindow,
} from "@ledget/ui"
import { useFlow } from '@ledget/ory'
import { LegalLinks } from "@components/index"
import {
    useLazyGetRegistrationFlowQuery,
    useCompleteRegistrationFlowMutation
} from '@features/orySlice'
import AuthSelectionWindow from './AuthSelection'
import UserInfoWindow from './UserInfo'

function SignUp() {
    const navigate = useNavigate()
    const { flow, fetchFlow, submit, result, flowStatus } = useFlow(
        useLazyGetRegistrationFlowQuery,
        useCompleteRegistrationFlowMutation,
        'registration'
    )
    const { isCompleteSuccess, errId } = flowStatus

    const [searchParams] = useSearchParams()
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (isCompleteSuccess) {
            sessionStorage.setItem(
                'identifier',
                JSON.stringify(result.identity?.traits.email)
            )
            ledgetapi.post('devices')
                .then(() => { navigate('/verification') })
                .catch(() => { navigate('/login') })
            // fall back to login if device creation fails
            // since they can always log in and then user will
            // be forced to verify and subscribe there instead
        }
    }, [isCompleteSuccess])

    // If the user is already logged in, redirect to the login redirect URL
    useEffect(() => {
        if (errId === 'session_already_available') {
            window.location.href = import.meta.env.VITE_LOGIN_REDIRECT
        }
    }, [errId])

    return (
        <>
            <AnimatePresence mode="wait">
                {Object.keys(userInfo).length === 0
                    ?
                    <SlideMotionDiv key="sign-up" position={flow ? 'first' : 'fixed'}>
                        <PortalWindow>
                            <UserInfoWindow
                                setUserInfo={setUserInfo}
                                flow={flow}
                                submit={submit}
                                flowStatus={flowStatus}
                            />
                            <LegalLinks />
                        </PortalWindow>
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv key="authenticate" position={'last'}>
                        <PortalWindow>
                            <AuthSelectionWindow
                                flow={flow}
                                submit={submit}
                                flowStatus={flowStatus}
                                userInfo={userInfo}
                                setUserInfo={setUserInfo}
                            />
                            <LegalLinks />
                        </PortalWindow>
                    </SlideMotionDiv>
                }
            </AnimatePresence >
            {searchParams.get('help') === 'true' && <PasskeyInfoModal />}
        </>
    )
}

export default SignUp
