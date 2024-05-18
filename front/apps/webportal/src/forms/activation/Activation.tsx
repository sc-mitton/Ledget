import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence } from "framer-motion"

import './styles/Activation.scss'
import {
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation,
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
} from '@features/orySlice'
import { useFlow } from '@ledget/ory'
import { PlainTextInput, MainButton, SlideMotionDiv, useLoaded } from '@ledget/ui'
import { WindowLoadingBar } from '@pieces/index'
import { Animation } from './Animation'


const schema1 = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const Step1 = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        flow,
        fetchFlow,
        submit,
        flowStatus
    } = useFlow(
        useLazyGetRecoveryFlowQuery,
        useCompleteRecoveryFlowMutation,
        'recovery'
    )
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema1>>({
        resolver: zodResolver(schema1)
    })

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (flowStatus.isCompleteSuccess) {
            searchParams.delete('flow')
            searchParams.set('step', '2')
            setSearchParams(searchParams)
        }
    }, [flowStatus.isCompleteSuccess])

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            <p>To finish joining another user's account, first enter your email address.</p>
            <form onSubmit={handleSubmit((_, e) => submit(e as any))} >
                <PlainTextInput
                    label="Email Address"
                    placeholder="Enter email address"
                    error={errors.email}
                    {...register('email')}
                />
                <input type='hidden' name='csrf_token' value={flow?.csrf_token} />
                <input type='hidden' name='code' value={searchParams.get('code') || ''} />
                <MainButton type="submit">Next</MainButton>
            </form>
        </>
    )
}

const traitsSchema = z.object({
    traits: z.object({
        first_name: z.string().min(1, 'First name is required'),
        last_name: z.string().min(1, 'Last name is required')
    }),
})
const passwordSchema = z.object({
    password: z.string().min(1, { message: 'required' }).min(10, { message: 'Password must be at least 10 characters' }),
    confirmPassword: z.string().min(1, { message: 'required' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
})

const Steps2and3 = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        register: traitsRegister,
        handleSubmit: handleTraitsSubmit,
        formState: { errors: traitsErrors }
    } = useForm<z.infer<typeof traitsSchema>>({
        resolver: zodResolver(traitsSchema)
    })
    const {
        register: passwordRegister,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors }
    } = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema)
    })
    const {
        flow,
        fetchFlow,
        submit,
        flowStatus
    } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (flowStatus.isCompleteSuccess && searchParams.get('step') === '3') {
            window.location.href = import.meta.env.VITE_ACTIVATION_REDIRECT
        } else if (flowStatus.isCompleteSuccess && searchParams.get('step') === '2') {
            searchParams.set('step', '3')
            setSearchParams(searchParams)
        }
    }, [flowStatus.isCompleteSuccess])

    const TraitsForm = () => {
        return (
            <>
                <SlideMotionDiv key='traits-form' position='default'>
                    <p>Enter your name</p>
                    <form onSubmit={handleTraitsSubmit((_, e) => submit(e as any))} >
                        <PlainTextInput
                            label="First Name"
                            placeholder="First name"
                            error={traitsErrors.traits?.first_name}
                            {...traitsRegister('traits.first_name')}
                        />
                        <PlainTextInput
                            label="Last Name"
                            placeholder="Last name"
                            error={traitsErrors.traits?.last_name}
                            {...traitsRegister('traits.last_name')}
                        />
                        <input type='hidden' name='csrf_token' value={flow.csrf_token} />
                        <input type='hidden' name='method' value='profile' />
                        <MainButton type="submit">Next</MainButton>
                    </form>
                </SlideMotionDiv>
            </>
        )
    }

    const PasswordForm = () => {
        return (
            <>
                <SlideMotionDiv key='password-form' position='last'>
                    <p>Set your password</p>
                    <form onSubmit={handlePasswordSubmit((_, e) => submit(e as any))} >
                        <PlainTextInput
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            error={passwordErrors.password}
                            {...passwordRegister('password')}
                        />
                        <PlainTextInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            error={passwordErrors.confirmPassword}
                            {...passwordRegister('confirmPassword')}
                        />
                        <input type='hidden' name='csrf_token' value={flow.csrf_token} />
                        <input type='hidden' name='method' value='password' />
                        <MainButton type="submit">Next</MainButton>
                    </form>
                </SlideMotionDiv>
            </>
        )
    }

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            {searchParams.get('step') === '2' && <TraitsForm />}
            {searchParams.get('step') === '3' && <PasswordForm />}
        </>
    )
}

const Activation = () => {
    const loaded = useLoaded(1000)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (!searchParams.get('step')) {
            searchParams.set('step', '1')
            window.location.search = searchParams.toString()
        }
    }, [])

    return (
        <div id='activation-flow' className="window">
            <h2>Join Household</h2>
            <Animation />
            <AnimatePresence mode='wait'>
                {searchParams.get('step') === '1'
                    ?
                    <SlideMotionDiv
                        key='activation'
                        position={'default'}
                    >
                        <Step1 />
                    </SlideMotionDiv>
                    :
                    <SlideMotionDiv
                        key='activation'
                        position={loaded ? 'first' : 'fixed'}
                    >
                        <Steps2and3 />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </div>
    )
}

export default Activation
