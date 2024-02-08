import { apiSlice } from '@api/apiSlice'

export const deviceSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        refreshDevices: builder.mutation<void, void>({
            query: () => ({
                url: 'devices',
                method: 'POST',
            })
        }),
    })
})

export const { useRefreshDevicesMutation } = deviceSlice
