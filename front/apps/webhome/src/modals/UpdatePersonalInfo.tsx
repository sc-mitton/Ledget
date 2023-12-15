import { useEffect } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import './styles/UpdatePersonalInfo.scss'
import { useSearchParams } from 'react-router-dom'
import { withSmallModal } from '@ledget/ui'
import { useFlow } from '@ledget/ory'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { useGetMeQuery } from '@features/userSlice'
import { PlainTextInput } from '@ledget/ui'
import { SubmitForm } from '@components/pieces'
import { withReAuth } from '@utils/withReAuth'

const schema = z.object({
    first: z.string().min(1, { message: 'required' }),
    last: z.string().min(1, { message: 'required' }),
    email: z.string().email()
})

const UpdatePersonalInfo = withReAuth(withSmallModal((props) => {
    const { flow, fetchFlow, completeFlow, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const { isCompletingFlow, isCompleteSuccess } = flowStatus
    const { data: user } = useGetMeQuery()
    const [searchParams, setSearchParams] = useSearchParams()
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            first: user?.name.first,
            last: user?.name.last,
            email: user?.email
        }
    })

    useEffect(() => {
        fetchFlow()
        return () => {
            searchParams.delete('flow')
            setSearchParams(searchParams)
        }
    }, [])

    return (
        <div>
            <h3>Update Personal Info</h3>
            <hr />
            <form
                onSubmit={handleSubmit((data, e) => {
                    console.log('data', data)
                    // completeFlow({
                    //     data: {
                    //         csrf_token: flow.csrf_token,
                    //         method: 'profile',
                    //         traits: data
                    //     }
                    // })
                })}
                id='update-personal-info-form'
            >
                <div>
                    <label htmlFor="name">Name</label>
                    <label htmlFor="email">Email</label>
                    <PlainTextInput
                        type="text"
                        placeholder="First Name"
                        {...register('first')}
                        error={errors.first}
                    />
                    <PlainTextInput
                        type="text"
                        placeholder="Last Name"
                        {...register('last')}
                        error={errors.last}
                    />
                    <label htmlFor="email">Email</label>
                    <PlainTextInput
                        type="text"
                        placeholder="Email"
                        {...register('email')}
                        error={errors.email}
                    />
                </div>
                <SubmitForm
                    submitting={isCompletingFlow}
                    success={isCompleteSuccess}
                    onCancel={() => props.closeModal()}
                />
            </form>
        </div>
    )
}))

export default UpdatePersonalInfo
