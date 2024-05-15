
import { useForm, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import './styles/AddUser.scss'
import {
    withSmallModal,
    PlainTextInput,
    useColorScheme,
    BlueSubmitWithArrow
} from '@ledget/ui'
import { useAddUserToAccountMutation } from '@features/userSlice'
import { withReAuth } from '@utils/index'
import { EnvelopeImage } from '@ledget/media'

const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const AddUserModal = withReAuth(withSmallModal((props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema)
    })
    const [linkUser, { data, isSuccess, isLoading }] = useAddUserToAccountMutation()
    const { isDark } = useColorScheme()

    return (
        <form onSubmit={handleSubmit(data => linkUser(data))} id="add-user-form">
            <h2>Send an Invite</h2>
            <div id='envelope-image' className={`${isDark ? 'dark' : 'light'}`}><EnvelopeImage dark={isDark} /></div>
            <p>Enter the email address of the person you'd like to add to your account.</p>
            <PlainTextInput
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                {...register('email')}
                error={errors.email as FieldError}
            />
            <BlueSubmitWithArrow type="submit" loading={isLoading} disabled={isLoading}>
                Send
            </BlueSubmitWithArrow>
        </form>
    )
}))

export default AddUserModal
