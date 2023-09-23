import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useNavigate } from 'react-router-dom'

import { } from '@features/orySlice'
import SubmitForm from '@components/pieces/SubmitForm'
import { PasswordInput, FormError } from '@ledget/shared-ui'
import { withSmallModal } from '@ledget/shared-utils'
import { withReAuth } from '@utils'
import { useFlow } from '@ledget/ory-sdk'
import { useUpdateUserMutation } from '@features/userSlice'
import { useLazyGetSettingsFlowQuery, useCompleteSettingsFlowMutation } from '@features/orySlice'

const schema = object().shape({
    password: string().required('Password is required').min(10, 'Minimum 10 characters'),
    confirmPassword: string().required().test('passwords-match', 'Passwords must match', function (value) {
        return value === this.parent.password;
    })
})

const ChangePassword = (props) => {
    const [updateUser] = useUpdateUserMutation()
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const {
        isFetchingFlow,
        errorFetchingFlow,
        isCompleteError,
        isCompleteSuccess,
        submittingFlow,
    } = flowStatus

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        let timeout
        if (isCompleteSuccess) {
            updateUser({ data: { password_last_changed: 'now' } })
            timeout = setTimeout(() => {
                props.setVisible(false)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isCompleteSuccess])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema), mode: 'onBlur', reValidateMode: 'onBlur'
    })
    const [pwdVisible, setPwdVisible] = useState(false)

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit((data, e) => submit(e))} id="change-password-form">
                <div
                    style={{
                        margin: '16px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}
                >
                    <div>
                        {(isCompleteError || errorFetchingFlow) &&
                            <FormError msg={"Something went wrong, please try again later."} />}
                        <h4 style={{ margin: '0 0 10px 2px' }}>Enter your new password</h4>
                        <PasswordInput
                            name="password"
                            placeholder="New password"
                            {...register("password")}
                            error={errors.password}
                            visible={pwdVisible}
                            setVisible={setPwdVisible}
                            loading={isFetchingFlow}
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
                            loading={isFetchingFlow}
                        />
                        <FormError msg={errors.confirmPassword?.message} />
                    </div>
                    <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                </div>
                <SubmitForm
                    name="method"
                    value="password"
                    onCancel={() => { props.setVisible(false) }}
                    submitting={submittingFlow}
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

