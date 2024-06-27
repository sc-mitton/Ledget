import { useEffect } from "react"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import styles from './styles/email-form.module.scss'
import {
    WindowHeader,
    Checkbox,
    FormError,
    PlainTextInput,
    MainButton
} from '@ledget/ui'
import { SocialAuth } from '@components/index'

const schema = z.object({
    email: z.string().min(1, { message: 'required' }).email({ message: 'Invalid email' }).transform(value => value.trim()),
    remember: z.union([z.boolean(), z.string()])
})

interface EmailFormProps {
    flow: any
    setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
    socialSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const EmailForm = ({ flow, setEmail, socialSubmit }: EmailFormProps) => {
    const { register, handleSubmit, formState: { errors }, setFocus } =
        useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onBlur' })

    const submit = (data: z.infer<typeof schema>) => {
        if (data.remember) {
            localStorage.setItem('login-email', JSON.stringify(data.email))
        } else {
            localStorage.removeItem('login-email')
        }
        setEmail(data.email)
    }

    useEffect(() => { setFocus('email') }, [])

    return (
        <>
            <div><h2>Sign in to Ledget</h2></div>
            <form onSubmit={handleSubmit(submit)} className={styles.form}>
                <div>
                    <PlainTextInput
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                    />
                    {errors['email'] && <FormError msg={errors['email'].message || ''} />}
                    <div className={styles.remember}>
                        <Checkbox id='checkbox' label='Remember me' {...register('remember')} />
                    </div>
                    <MainButton>Continue</MainButton>
                </div>
            </form >
            <SocialAuth flow={flow} submit={socialSubmit} />
        </>
    )
}

export default EmailForm
