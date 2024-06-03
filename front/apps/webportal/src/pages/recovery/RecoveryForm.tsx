import { useNavigate } from 'react-router-dom'

import { BackButton, MainButton, PlainTextInput } from '@ledget/ui'
import MainGraphic from './Graphic'
import Error from './Error'
import styles from './styles/form.module.scss'

interface Props {
    flow: any
    submit: (e: any) => void
    isCompleteError: boolean
    errMsg?: string
}

const RecoveryForm = ({ flow, submit, isCompleteError, errMsg }: Props) => {
    const navigate = useNavigate()

    return (
        <>
            <div>
                <div style={{ margin: '0 0 .5em -.25em' }}>
                    <BackButton
                        onClick={() => { navigate('/login') }}
                        style={{ float: 'none' }}
                    />
                </div>
                <h2>Forgot password?</h2>
                <div style={{ margin: '.5em 0' }}>
                    <span>
                        Enter the email connected to your account and we'll
                        send you a recovery code.
                    </span>
                </div>
                {(isCompleteError || errMsg) && <Error msg={errMsg} />}
            </div>
            <MainGraphic />
            <form
                onSubmit={submit}
                className={styles.recoveryForm}
                id='send-recovery-code-form'
            >
                <PlainTextInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    name="email"
                    autoFocus
                    required
                />
                <input type="hidden" name="csrf_token" value={flow?.csrf_token} />
                <MainButton
                    name='method'
                    type="submit"
                    value="code"
                >
                    Send code
                </MainButton>
            </form>
        </>
    )
}

export default RecoveryForm
