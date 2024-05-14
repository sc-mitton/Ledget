
import { useForm, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
    withSmallModal,
    PlainTextInput
} from '@ledget/ui'
import { useLinkUserMutation } from '@features/userSlice'
import { withReAuth } from '@utils/index'

const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const AddUserModal = withReAuth(withSmallModal((props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema)
    })
    const [linkUser, { data, isSuccess, isLoading }] = useLinkUserMutation()

    return (
        <form onSubmit={handleSubmit(data => linkUser(data))}>
            <h2>Send an Invite</h2>
            <p>Enter the email address of the person you'd like to add to your account.</p>
            <PlainTextInput
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                {...register('email')}
                error={errors.email as FieldError}
            />
        </form>
    )
}))

export default AddUserModal
