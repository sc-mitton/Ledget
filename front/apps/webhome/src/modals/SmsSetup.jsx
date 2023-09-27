import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { useForm, useController, set } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import './styles/SmsSetup.css'
import { withModal } from '@ledget/shared-utils'
import { withReAuth } from '@utils'
import {
    useCreateOtpMutation,
    useVerifyOtpMutation,
} from '@features/userSlice'
import {
    BackButton,
    GreenSubmitWithArrow,
    GreenSubmitButton,
    SecondaryButton,
    PlainTextInput,
    FormError,
    JiggleDiv,
    SlideMotionDiv,
    KeyPadGraphic,
} from '@ledget/shared-ui'


const schema = object().shape({
    phone: string().required('required')
})

const SmsAdd = (props) => {
    const [addOtp, { isLoading: addOtpLoading, isError: addOtpError }] = useCreateOtpMutation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [value, setValue] = useState('')

    const { handleSubmit, register, setFocus } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        revalidateMode: 'onBlur'
    })
    const { onChange: formChange, ...rest } = register('phone')


    const handleAutoFormat = (e) => {
        const { value } = e.target
        console.log(value)
        // Auto format like (000) 000-0000 and only except numbers
        let formatted = value.replace(/[^0-9]/g, '')
        formatted = formatted.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

        setValue(formatted)
    }

    const onSubmit = (data) => {
        searchParams.set('step', 'verify')
        setSearchParams(searchParams)

    }

    useEffect(() => { setFocus('phone') }, [])

    return (
        <div>
            <h2>Text Message</h2>
            <h4>2-Step Verification Setup</h4>
            <form
                id="sms-setup-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div >
                    <div>
                        <KeyPadGraphic />
                    </div>
                    <span>
                        Enter your phone number
                    </span>
                    <PlainTextInput
                        name="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        autoComplete="tel"
                        value={value}
                        onChange={(e) => {
                            handleAutoFormat(e)
                            formChange(e)
                        }}
                        {...rest}
                        autoFocus
                    />
                    {addOtpError && <FormError msg={'Check your number and try again please.'} />}
                </div>
                <div>
                    <SecondaryButton
                        type="button"
                        onClick={() => { props.setVisible(false) }}
                    >
                        Cancel
                    </SecondaryButton>
                    <GreenSubmitWithArrow loading={addOtpLoading}>
                        Next
                    </GreenSubmitWithArrow>
                </div>
            </form>
        </div>
    )
}

const SmsVerify = (props) => {
    return (
        <JiggleDiv>

        </JiggleDiv>
    )
}

const SmsSetup = (props) => {
    const [searchParams] = useSearchParams()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => { setLoaded(true) }, [])

    return (
        <div>
            <AnimatePresence mode="wait">
                {searchParams.get('step') === 'verify'
                    ?
                    <SlideMotionDiv last>
                        <SmsVerify props={props} />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv first={loaded}>
                        <SmsAdd props={props} />
                    </SlideMotionDiv>
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
