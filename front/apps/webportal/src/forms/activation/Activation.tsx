import { useEffect, useState, useContext, createContext } from "react"
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
import {
    PlainTextInput,
    PasswordInput,
    MainButton,
    SlideMotionDiv,
    useLoaded,
    Otc,
    FormError
} from '@ledget/ui'
import { WindowLoadingBar } from '@pieces/index'
import { Animation } from './Animation'

interface EmailContext {
    email?: string
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
}

const emailContext = createContext<EmailContext | null>(null)
const EmailContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string | undefined>()
    return (
        <emailContext.Provider value={{ email, setEmail }}>
            {children}
        </emailContext.Provider>
    )
}
const useEmailContext = () => {
    const email = useContext(emailContext)
    if (email === null) {
        throw new Error('useEmailContext must be used within a EmailProvider')
    }
    return email
}

const sendCodeSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const SendCodeForm = ({ submit, csrf_token }: { submit: React.FormEventHandler<HTMLFormElement>, csrf_token: string }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof sendCodeSchema>>({
        resolver: zodResolver(sendCodeSchema)
    })
    const { setEmail } = useEmailContext()

    return (
        <>
            <div className='step'>
                <span>Step 1 of 4</span>
                <span>To finish joining another user's account, first enter your email address.</span>
            </div>
            <form onSubmit={handleSubmit((data, e) => { submit(e as any); setEmail(data.email); })} >
                <PlainTextInput
                    label="Email Address"
                    placeholder="Enter email address"
                    error={errors.email}
                    {...register('email')}
                />
                <input type='hidden' name='csrf_token' value={csrf_token} />
                <MainButton name='method' type="submit" value="code">
                    Send Code
                </MainButton>
            </form>
        </>
    )
}

const ConfirmCodeForm = ({ submit, csrf_token }: { submit: React.FormEventHandler<HTMLFormElement>, csrf_token: string }) => (
    <>
        <div className='step'>
            <span>Step 2 of 4</span>
            <span>Enter the code sent to your email address.</span>
        </div>
        <form onSubmit={submit} >
            <Otc codeLength={6} />
            <input type='hidden' name='csrf_token' value={csrf_token} />
            <MainButton type="submit" name="method" value="code">
                Confirm
            </MainButton>
        </form>
    </>
)

const SendAndConfirmCodeSteps = () => {
    const loaded = useLoaded(1000)
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

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (flowStatus.isCompleteSuccess && searchParams.get('step') === 'send-code') {
            searchParams.set('step', 'confirm-code')
            setSearchParams(searchParams)
        }
    }, [flowStatus.isCompleteSuccess])

    useEffect(() => {
        if (flowStatus.errId === 'browser_location_change_required') {
            searchParams.set('step', 'set-traits')
            searchParams.delete('flow')
            setSearchParams(searchParams)
        }
    }, [flowStatus.errId])

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            <AnimatePresence mode='wait'>
                {searchParams.get('step') === 'send-code' &&
                    <SlideMotionDiv key='send-code' position={loaded ? 'first' : 'fixed'}>
                        <SendCodeForm submit={submit} csrf_token={flow?.csrf_token} />
                    </SlideMotionDiv>
                }
                {searchParams.get('step') === 'confirm-code' &&
                    <SlideMotionDiv key='confirm-code' position='last'>
                        <ConfirmCodeForm submit={submit} csrf_token={flow?.csrf_token} />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </>
    )
}

const traitsSchema = z.object({
    first: z.string().min(1, { message: 'required' }).transform(value => value.trim()),
    last: z.string().min(1, { message: 'required' }).transform(value => value.trim())
})

const AddTraitsForm = ({ submit, csrf_token }: { submit: (data: any) => void, csrf_token: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof traitsSchema>>({
        resolver: zodResolver(traitsSchema)
    })
    const { email } = useEmailContext()

    const onSubmit = (data: any) => {
        submit({ traits: { name: { ...data }, email }, method: 'profile', csrf_token })
    }

    return (
        <>
            <div className='step'>
                <span>Step 3 of 4</span>
                <span>Enter your Name</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <PlainTextInput
                    label="First Name"
                    placeholder="First name"
                    error={errors?.first}
                    {...register('first')}
                />
                <PlainTextInput
                    label="Last Name"
                    placeholder="Last name"
                    error={errors?.last}
                    {...register('last')}
                />
                <MainButton type="submit">Next</MainButton>
            </form>
        </>
    )
}

const passwordSchema = z.object({
    password: z.string().min(1, { message: 'required' }).min(10, { message: 'Password must be at least 10 characters' }),
    confirmPassword: z.string().min(1, { message: 'required' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
})

const PasswordForm = ({ submit, csrf_token }: { submit: React.FormEventHandler<HTMLFormElement>, csrf_token: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema)
    })
    const [pwdVisible, setPwdVisible] = useState(false)

    return (
        <>
            <div className='step'>
                <span>Step 4 of 4</span>
                <span>Set your password</span>
            </div>
            <form onSubmit={handleSubmit((_, e) => submit(e as any))} >
                <PasswordInput
                    placeholder="New password"
                    {...register("password")}
                    error={errors.password}
                    visible={pwdVisible}
                    setVisible={setPwdVisible}
                />
                <PasswordInput
                    placeholder="Confirm password"
                    inputType="confirm-password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword}
                    visible={pwdVisible}
                />
                <input type='hidden' name='csrf_token' value={csrf_token} />
                <input type='hidden' name='method' value='password' />
                <MainButton type="submit">Next</MainButton>
            </form>
        </>
    )
}

const AddTraitsAndPasswordSteps = () => {
    const loaded = useLoaded(1000)
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        flow,
        fetchFlow,
        submit,
        submitData,
        flowStatus
    } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )

    useEffect(() => { fetchFlow() }, [])

    useEffect(() => {
        if (flowStatus.isCompleteSuccess) {
            if (searchParams.get('step') === 'set-traits') {
                searchParams.set('step', 'set-password')
                setSearchParams(searchParams)
            } else {
                window.location.href = import.meta.env.VITE_ACTIVATION_REDIRECT
            }
        }
    }, [flowStatus.isCompleteSuccess])

    useEffect(() => {
        if (flowStatus.errId === 'session_refresh_required') {
            searchParams.set('step', 'send-code')
            searchParams.delete('flow')
            setSearchParams(searchParams)
        }
    }, [flowStatus.errId])

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            <AnimatePresence mode='wait'>
                {searchParams.get('step') === 'set-traits' &&
                    <SlideMotionDiv key='add-traits' position={loaded ? 'first' : 'fixed'}>
                        <AddTraitsForm submit={submitData} csrf_token={flow?.csrf_token} />
                    </SlideMotionDiv>
                }
                {searchParams.get('step') === 'set-password' &&
                    <SlideMotionDiv key='set-password' position='last'>
                        <PasswordForm submit={submit} csrf_token={flow?.csrf_token} />
                    </SlideMotionDiv>
                }
            </AnimatePresence>
        </>
    )
}

const Activation = () => {
    const loaded = useLoaded(1000)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (!searchParams.get('step')) {
            searchParams.set('step', 'send-code')
            setSearchParams(searchParams)
        }
    }, [])

    return (
        <div id='activation-flow' className="window">
            <h2>Join Household</h2>
            <Animation />
            <EmailContextProvider>
                <AnimatePresence mode='wait'>
                    {[null, 'send-code', 'confirm-code'].includes(searchParams.get('step'))
                        ?
                        <SlideMotionDiv key='activation' position={loaded ? 'first' : 'fixed'}>
                            <SendAndConfirmCodeSteps />
                        </SlideMotionDiv>
                        :
                        <SlideMotionDiv key='activation' position={loaded ? 'last' : 'fixed'}>
                            <AddTraitsAndPasswordSteps />
                        </SlideMotionDiv>
                    }
                </AnimatePresence>
            </EmailContextProvider>
        </div>
    )
}

export default Activation
