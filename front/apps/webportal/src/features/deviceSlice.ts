import { apiSlice } from '@ledget/shared-features'

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
