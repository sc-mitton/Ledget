import { useEffect, useState } from 'react'
import { useForm, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence } from 'framer-motion'

import './styles/AddUser.scss'
import {
    withSmallModal,
    PlainTextInput,
    useColorScheme,
    MainButton,
    FormError,
    SlideMotionDiv
} from '@ledget/ui'
import { useAddUserToAccountMutation } from '@features/userSlice'
import { withReAuth } from '@utils/index'
import { hasErrorCode } from '@api/helpers'
import { useLoaded } from '@utils/hooks'
import { ExternalLink } from '@geist-ui/icons'


const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address')
})

const Slide1 = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema)
    })
    const [linkUser, { error, isLoading }] = useAddUserToAccountMutation({
        fixedCacheKey: 'addUserToAccount'
    })
    const { isDark } = useColorScheme()

    return (
        <form onSubmit={handleSubmit(data => linkUser(data))} id="add-user-form">
            <h2>Add Household Member</h2>
            <div id='envelope-image' className={`${isDark ? 'dark' : 'light'}`}>

            </div>
            <p>Enter the email address of the person you'd like to add to your account.</p>
            <PlainTextInput
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                {...register('email')}
                error={errors.email as FieldError}
            />
            {hasErrorCode('ACTIVATION_LINK_FAILED', error) &&
                <FormError msg={'Woops, looks like something went wrong, please try again in a few hours.'} />}
            <MainButton type="submit" submitting={isLoading} disabled={isLoading}>
                Send
            </MainButton>
        </form>
    )
}

const Slide2 = () => {
    const [, { data, reset }] = useAddUserToAccountMutation({ fixedCacheKey: 'addUserToAccount' })
    const { isDark } = useColorScheme()
    const [expiresIn, setExpiresIn] = useState<number | null>(null)

    useEffect(() => {
        if (data) {
            setExpiresIn(Math.ceil((new Date(data.expires_at).getTime() - Date.now()) / 1000 / 60))
            const interval = setInterval(() => {
                setExpiresIn(Math.ceil((new Date(data.expires_at).getTime() - Date.now()) / 1000 / 60))
            }, 1000 * 60)
            return () => clearInterval(interval)
        }
    }, [data])

    useEffect(() => {
        if (expiresIn && expiresIn <= 0) {
            reset()
        }
    }, [expiresIn])

    return (
        <div id='create-linked-account-qr-code' className={`${isDark ? 'dark' : 'light'}`}>
            {data &&
                <>
                    <div><img src={data.recovery_link_qr} alt='qr code' /></div>
                    <a>Finish <ExternalLink className='icon' /></a>
                    <h4>To finish scan the qr code or follow the link</h4>
                    <span>Link expires in {expiresIn} minutes</span>
                </>
            }
        </div>
    )
}

const AddUserModal = withReAuth(withSmallModal((props) => {
    const isLoaded = useLoaded(500)
    const [, { isSuccess }] = useAddUserToAccountMutation({
        fixedCacheKey: 'addUserToAccount'
    })

    return (
        <AnimatePresence mode='wait'>
            {isSuccess
                ? <SlideMotionDiv key='slide2' position={isLoaded ? 'last' : 'fixed'}>
                    <Slide2 />
                </SlideMotionDiv>
                : <SlideMotionDiv key='slide1' position={isLoaded ? 'first' : 'fixed'}>
                    <Slide1 />
                </SlideMotionDiv>}
        </AnimatePresence>
    )
}))

export default AddUserModal
