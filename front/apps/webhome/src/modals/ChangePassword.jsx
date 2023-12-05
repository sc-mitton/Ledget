import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { } from '@features/orySlice'
import SubmitForm from '@components/pieces/SubmitForm'
import { PasswordInput, FormError } from '@ledget/ui'
import { withSmallModal } from '@ledget/ui'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'
import { useLazyGetSettingsFlowQuery, useCompleteSettingsFlowMutation } from '@features/orySlice'

const schema = z.object({
    password: z.string().min(1, { message: 'required' }).min(10, { message: 'Password must be at least 10 characters' }),
    confirmPassword: z.string().min(1, { message: 'required' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
})


const ChangePassword = (props) => {
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isGettingFlow,
        errorFetchingFlow,
        isCompleteError,
        isCompleteSuccess,
        isCompletingFlow,
    } = flowStatus

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur'
    })
    const [pwdVisible, setPwdVisible] = useState(false)

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit((data, e) => submit(e))} id="change-password-form">
                <div
                    style={{
                        margin: '1em 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.25em'
                    }}
                >
                    <div>
                        {(isCompleteError || errorFetchingFlow) &&
                            <FormError msg={"Something went wrong, please try again later."} />}
                        <h4 style={{ margin: '0 0 .625em .125em' }}>Enter your new password</h4>
                        <PasswordInput
                            name="password"
                            placeholder="New password"
                            {...register("password")}
                            error={errors.password}
                            visible={pwdVisible}
                            setVisible={setPwdVisible}
                            loading={isGettingFlow}
                        />
                        <FormError msg={errors.password?.message} />
                    </div>
                    <div>
                        <PasswordInput
                            name="confirmPassword"
                            placeholder="Confirm password"
                            inputType="confirm-password"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword}
                            visible={pwdVisible}
                            loading={isGettingFlow}
                        />
                        <FormError msg={errors.confirmPassword?.message} />
                    </div>
                    <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                </div>
                <SubmitForm
                    name="method"
                    value="password"
                    onCancel={() => { props.closeModal() }}
                    submitting={isCompletingFlow}
                    success={isCompleteSuccess}
                />
            </form>
        </div>
    )
}

const EnrichedModal = withReAuth(withSmallModal(ChangePassword))

export default function () {
    const navigate = useNavigate()

    return (
        <EnrichedModal
            onClose={() => navigate('/profile/security')}
            blur={1}
        />
    )
}

