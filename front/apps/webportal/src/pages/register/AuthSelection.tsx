import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from "react-hook-form"

import styles from './styles/styles.module.scss'
import { Props } from './types'
import { PasswordlessForm } from "@components/index"
import {
    MainButton,
    FormError,
    PasswordInput,
    BackButton,
    ColumnWindowHeader,
    WindowLoadingBar
} from "@ledget/ui"

const passwordSchema = z.object({
    password: z.string().min(10, { message: 'Minimum 10 characters' })
})

const AuthSelectionWindow = ({ userInfo, setUserInfo, flow, flowStatus, submit }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur', reValidateMode: 'onBlur',
        resolver: zodResolver(passwordSchema)
    })

    return (
        <>
            <WindowLoadingBar visible={flowStatus.isCompletingFlow} />
            <ColumnWindowHeader>
                {typeof (PublicKeyCredential) != "undefined"
                    ? <h2>Sign In Method</h2>
                    : <h2>Create a Password</h2>}
                <BackButton text={'Step 2 of 4'} onClick={() => setUserInfo({})} />
            </ColumnWindowHeader>
            <div className={styles.authSelectionContainer}>
                <form
                    action={flow?.ui.action}
                    method={flow?.ui.method}
                    onSubmit={handleSubmit((data, e) => submit(e))}
                    className={styles.authForm}
                >
                    <div className={styles.error}>
                        <FormError msg={flowStatus.errMsg} />
                    </div>
                    <label htmlFor="password">Password</label>
                    <PasswordInput
                        placeholder="Enter a password..."
                        error={errors.password}
                        {...register('password')}
                    />
                    <FormError msg={errors.password?.message as string} />
                    <input type='hidden' name='csrf_token' value={flow?.csrf_token} />
                    <input type='hidden' name='traits.email' value={userInfo.email} />
                    <input type='hidden' name='traits.name.first' value={userInfo.firstName} />
                    <input type='hidden' name='traits.name.last' value={userInfo.lastName} />
                    <MainButton className={styles.continue} name="method" value="password" type="submit">
                        Create
                    </MainButton>
                </form >
                {typeof (PublicKeyCredential) != "undefined" &&
                    <PasswordlessForm flow={flow}>
                        <input type='hidden' name='traits.email' value={userInfo.email} />
                        <input type='hidden' name='traits.name.first' value={userInfo.firstName} />
                        <input type='hidden' name='traits.name.last' value={userInfo.lastName} />
                        <input type='hidden' name='webauthn_register_displayname' value={userInfo.email} />
                    </PasswordlessForm>
                }
            </div>
        </>
    )
}

export default AuthSelectionWindow
