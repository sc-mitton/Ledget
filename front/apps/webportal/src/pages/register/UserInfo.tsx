
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import styles from './styles/styles.module.scss'
import { Props } from './types'
import {
    ColumnWindowHeader,
    FormError,
    MainButton,
    PlainTextInput,
    WindowLoadingBar
} from '@ledget/ui'
import { SocialAuth } from '@components/index'

const schema = z.object({
    firstName: z.string().min(1, { message: 'required' }).transform(v => v.trim()),
    lastName: z.string().min(1, { message: 'required' }).transform(v => v.trim()),
    email: z.string().min(1, { message: 'required' }).email({ message: 'Invalid email' }).transform(v => v.trim())
}).required()

const UserInfoWindow = ({ setUserInfo, flow, submit, flowStatus }: Omit<Props, 'userInfo'>) => {
    // Form window for entering user info (name, email), or signing in with social auth
    const { register, handleSubmit, formState: { errors } }
        = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onSubmit', reValidateMode: 'onBlur' })

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isGettingFlow} />
            <ColumnWindowHeader>
                <h2>Create Account</h2>
                <span>Step 1 of 4</span>
            </ColumnWindowHeader>
            <form
                onSubmit={handleSubmit((e) => setUserInfo(e))}
                noValidate
            >
                <div><FormError msg={flowStatus.errMsg} /></div>
                <label htmlFor="name">Name</label>
                <div className={styles.splitInputs}>
                    <PlainTextInput
                        id="name"
                        placeholder="First"
                        error={errors?.firstName}
                        {...register('firstName')}
                    />
                    <PlainTextInput
                        id="name"
                        placeholder="Last"
                        error={errors?.lastName}
                        {...register('lastName')}
                    />
                </div>
                <label htmlFor="email">Email</label>
                <PlainTextInput
                    id="email"
                    placeholder="Email"
                    required
                    error={errors.email}
                    {...register('email')}
                />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                {errors.email?.type !== 'required' &&
                    <div className={styles.error}>
                        <FormError msg={errors.email?.message as string} />
                    </div>
                }
                <div
                    style={{ marginTop: '1em' }}
                >
                    <MainButton type='submit' aria-label="Submit form">
                        Continue
                    </MainButton>
                </div>
            </form>
            <SocialAuth flow={flow} submit={submit} className={styles.socialAuthContainer} />
        </>
    )
}

export default UserInfoWindow
