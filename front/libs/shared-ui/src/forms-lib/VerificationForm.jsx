import { useState, useEffect, useRef } from 'react'

import './styles/Verification.css'
import { GreenSubmitButton, ResendButton } from '../buttons-lib/buttons'
import Otc from '../inputs-lib/Otc'

const VerificationForm = (props) => {
    const { flow, submit, identifier, refreshSuccess, loading, submitting } = props
    const [otcDisabled, setOtcDisabled] = useState(false)
    const resendRef = useRef('')
    const [hasInitialSent, setHasInitialSent] = useState(false)

    useEffect(() => {
        flow ? setOtcDisabled(false) : setOtcDisabled(true)
    }, [flow])

    useEffect(() => {
        const timeout = setTimeout(() => {
            flow && resendRef?.current.click()
        }, 100)
        return () => clearTimeout(timeout)
    }, [flow])

    useEffect(() => {
        refreshSuccess && setHasInitialSent(true)
    }, [])

    return (
        <>
            <div id='verification-form-container'>
                <form
                    action={flow?.ui.action}
                    method={flow?.ui.method}
                    onSubmit={submit}
                >
                    <Otc codeLength={6} />
                    <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                    <input type="hidden" name="email" value={identifier} />
                    <GreenSubmitButton
                        type="submit"
                        name="method"
                        value="code"
                        disabled={otcDisabled}
                        loading={hasInitialSent && loading}
                        submitting={hasInitialSent && submitting}
                    >
                        Submit
                    </GreenSubmitButton>
                </form>
                <form
                    action={flow?.ui.action}
                    method={flow?.ui.method}
                    onSubmit={submit}
                >
                    <ResendButton
                        success={hasInitialSent && refreshSuccess}
                        aria-label="Resend email"
                        type="submit"
                        name="method"
                        value="code"
                        ref={resendRef}
                    />
                    <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                    <input type="hidden" name="email" value={identifier} />
                </form>
            </div>
        </>
    )
}
export default VerificationForm
