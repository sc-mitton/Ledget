
import styles from './styles/styles.module.scss'
import { MainButton, Otc } from '@ledget/ui'

const ConfirmCodeForm = ({ submit, csrf_token }: { submit: React.FormEventHandler<HTMLFormElement>, csrf_token: string }) => (
    <>
        <div className={styles.step}>
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

export default ConfirmCodeForm
