import React, { useState, useEffect } from 'react'

import "./styles/Logout.css"
import { withSmallModal } from '@ledget/shared-utils'
import { SecondaryButton, GreenSubmitButton } from '@ledget/shared-ui'
import { useGetLogoutFlowQuery, useLazyGetUpdatedLogoutFlowQuery } from '@features/orySlice'

function Logout(props) {
    const [quedLogout, setQuedLogout] = useState(false)
    const [seconds, setSeconds] = useState(30)

    const {
        data: flow,
        isSuccess: fetchedFlow,
        isLoading: fetchingFlow,
        isError: errorFetchingFlow
    } = useGetLogoutFlowQuery()
    const [
        updateLogoutFlow,
        { isSuccess: logOutSuccess, isLoading: loggingOut }
    ] = useLazyGetUpdatedLogoutFlowQuery()

    // Auto logout feature
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1)
        }, 1000)
        return () => { clearInterval(timer) }
    }, [])

    useEffect(() => {
        seconds <= 0 && setQuedLogout(true)
    }, [seconds])

    useEffect(() => {
        if (quedLogout && fetchedFlow) {
            updateLogoutFlow({ token: flow?.logout_token })
        }
    }, [quedLogout, fetchedFlow])

    useEffect(() => {
        if (logOutSuccess) {
            window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URL
        }
    }, [logOutSuccess])

    useEffect(() => {
        errorFetchingFlow && props.closeModal()
    }, [errorFetchingFlow])

    return (
        <div>
            <h2>Sign out of your account?</h2>
            <div id="logout-countdown">
                <span>Your session will end in {seconds} seconds.</span>
            </div>
            <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '8px' }}>
                <SecondaryButton
                    onClick={() => props.closeModal()}
                    aria-label="Cancel"
                >
                    Cancel
                </SecondaryButton>
                <GreenSubmitButton
                    onClick={() => { setQuedLogout(true) }}
                    submitting={(fetchingFlow && quedLogout) || loggingOut}
                    aria-label="Sign out"
                >
                    Logout
                </GreenSubmitButton>
            </div>
        </div>
    )
}

const LogoutModal = withSmallModal(Logout)

export default LogoutModal
