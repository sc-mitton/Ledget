
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import styles from './styles/styles.module.scss'
import {
    PlainTextInput,
    MainButton,
} from '@ledget/ui'
import { useEmailContext } from './context'
import { SubHeader } from '@components/index'


const sendCodeSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const SendCodeForm = ({ submit, csrf_token }: { submit: React.FormEventHandler<HTMLFormElement>, csrf_token?: string }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof sendCodeSchema>>({
        resolver: zodResolver(sendCodeSchema)
    })
    const { setEmail } = useEmailContext()

    return (
        <>
            <div className={styles.step}>
                <span>Step 1 of 4</span>
                <SubHeader>To finish joining another user's account, first enter your email address.</SubHeader>
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

export default SendCodeForm
