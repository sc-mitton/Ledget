import { apiSlice } from '@api/apiSlice'

apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        refreshDevices: builder.mutation({
            query: () => ({
                url: 'devices',
                method: 'POST',
            })
        }),
    })
})

export const { useRefreshDevicesMutation } = apiSlice
