import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'user/me',
            tags: ['user'],
        }),
        getPaymentMethod: builder.query({
            query: () => 'payment_methods',
            keepUnusedDataFor: 180,
        }),
        getSetupIntent: builder.query({
            query: () => ({
                url: 'setup_intent',
                method: 'GET',
            }),
            onSuccess: (data) => {
                sessionStorage.setItem('setupIntent', JSON.stringify(data))
            },
        }),
        updateUser: builder.mutation({
            query: ({ data, userId }) => ({
                url: `user/${userId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['user'],
        }),

    })
})

export const {
    useGetMeQuery,
    useGetPaymentMethodQuery,
    useUpdateUserMutation,
    useGetSetupIntentQuery,
} = extendedApiSlice
