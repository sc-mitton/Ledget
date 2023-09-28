import { apiSlice } from '@api/apiSlice'


apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOtp: builder.mutation({
            query: ({ data }) => ({
                url: 'otp',
                method: 'POST',
                body: data,
            }),
            transformResponse: response => response.data
        }),
        verifyOtp: builder.mutation({
            query: ({ data, id }) => ({
                url: `otp/${id}`,
                method: 'GET',
                body: data,
            }),
        }),
    })
})

export const { useCreateOtpMutation, useVerifyOtpMutation } = apiSlice
