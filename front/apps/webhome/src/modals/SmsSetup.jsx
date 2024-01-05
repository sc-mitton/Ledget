import { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './styles/SmsSetup.scss'
import { withModal } from '@ledget/ui'
import { withReAuth } from '@utils'
import { useCreateOtpMutation, useVerifyOtpMutation } from '@features/authSlice'
import { useGetMeQuery } from '@features/userSlice'
import {
    BackButton,
    BlueSubmitWithArrow,
    LightGrnWideButton,
    SecondaryButton,
    PhoneInput,
    FormError,
    JiggleDiv,
    SlideMotionDiv,
    KeyPadGraphic,
    Otc,
    useLoaded
} from '@ledget/ui'


const schema = z.object({
    phone: z.string().transform((value) => value.replace(/[^0-9]/g, '')),
    country_code: z.string(),
})


const SmsAdd = (props) => {
    const [createOtp, { data: result, isLoading, isSuccess, isError }] = useCreateOtpMutation()
    const [searchParams, setSearchParams] = useSearchParams()

    const { handleSubmit, register } = useForm({
        resolver: zodResolver(schema), mode: 'onSubmit', revalidateMode: 'onBlur'
    })
    const { onChange: formChange, ...rest } = register('phone')

    const onSubmit = (data) => { createOtp({ data: data }) }

    useEffect(() => {
        let timeout
        if (isSuccess) {
            timeout = setTimeout(() => {
                searchParams.set('id', result.id)
                setSearchParams(searchParams)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isSuccess])

    return (
        <div>
            <h2>Text Message</h2>
            <h4>2-Step Verification Setup</h4>
            <form
                id="otp-setup-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Other countries may be needed in future */}
                <div >
                    <div><KeyPadGraphic finished={isSuccess} /></div>
                    <span>Enter your phone number</span>
                    <PhoneInput onChange={formChange} {...rest} />
                    <input
                        type="hidden"
                        name="country_code"
                        value={1}
                        {...register('country_code')}
                    />
                    {isError && <FormError msg={'Check your number and try again please.'} />}
                </div>
                <div>
                    <SecondaryButton
                        type="button"
                        onClick={() => { props.closeModal() }}
                    >
                        Cancel
                    </SecondaryButton>
                    <BlueSubmitWithArrow submitting={isLoading}>
                        Next
                    </BlueSubmitWithArrow>
                </div>
            </form>
        </div>
    )
}

const SmsVerify = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [verifyOtp, { isLoading, isSucess, isError }] = useVerifyOtpMutation()

    const onSubmit = (e) => {
        const data = Object.fromEntries(new FormData(e.target))
        verifyOtp({
            data: { 'code': data.code },
            id: searchParams.get('id')
        })
    }

    useEffect(() => {
        let timeout
        if (isSucess) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1200)
        }
        return () => clearTimeout(timeout)
    }, [isSucess])

    return (
        <JiggleDiv jiggle={isError}>
            <h3>Enter the code we texted you</h3>
            <div >
                <BackButton
                    onClick={() => {
                        searchParams.delete('id')
                        setSearchParams(searchParams)
                    }}
                />
            </div>
            <form
                id="otp-verify-form"
                onSubmit={onSubmit}
            >
                <div >
                    <Otc colorful={false} />
                </div>
                <div>
                    <LightGrnWideButton
                        submitting={isLoading}
                        success={isSucess}
                    >
                        Verify
                    </LightGrnWideButton>
                </div>
            </form>
        </JiggleDiv>
    )
}

const SmsSetup = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const loaded = useLoaded(1000)
    const { data: user } = useGetMeQuery()

    useEffect(() => {
        if (user.mfa_method !== 'totp') {
            searchParams.set('continue', true)
            setSearchParams(searchParams)
        }
    }, [])

    return (
        <div>
            <AnimatePresence mode="wait">
                {/* Step 1: Confirm Step in case user has authenticator app */}
                {!searchParams.get('continue')
                    ?
                    <SlideMotionDiv position={loaded ? 'first' : 'fixed'}>
                        <h2>Are you sure?</h2>
                        <div style={{ margin: '.75em 0' }}>
                            Adding text message verification will
                            remove your authenticator app.
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <SecondaryButton
                                type="button"
                                onClick={() => props.closeModal()}
                            >
                                Cancel
                            </SecondaryButton>
                            <BlueSubmitWithArrow
                                onClick={() => {
                                    searchParams.set('continue', true)
                                    setSearchParams(searchParams)
                                }}
                            >
                                Continue
                            </BlueSubmitWithArrow>
                        </div>
                    </SlideMotionDiv>
                    :
                    <>
                        {!searchParams.get('id')
                            ?
                            // Step 2: Add Phone Number
                            <SlideMotionDiv position={'fixed'}>
                                <SmsAdd {...props} />
                            </SlideMotionDiv>
                            :
                            // Step 3: Confirm Code
                            <SlideMotionDiv position={'last'}>
                                <SmsVerify {...props} />
                            </SlideMotionDiv>
                        }
                    </>
                }
            </AnimatePresence>
        </div>
    )
}

const SmsSetupModal = withReAuth(withModal(SmsSetup))

export default function () {
    const navigate = useNavigate()

    return (
        <SmsSetupModal
            onClose={() => navigate('/profile/security')}
            blur={1}
            maxWidth={300}
        />
    )
}
