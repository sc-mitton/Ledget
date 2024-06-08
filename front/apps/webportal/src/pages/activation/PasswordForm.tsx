import { useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import styles from './styles/styles.module.scss'
import { PasswordInput, MainButton } from '@ledget/ui'
import { SubHeader } from '@components/index'

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
            <div className={styles.step}>
                <span>Step 4 of 4</span>
                <SubHeader>Set your password</SubHeader>
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

export default PasswordForm
