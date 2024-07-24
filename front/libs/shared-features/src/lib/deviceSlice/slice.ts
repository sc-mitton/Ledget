import apiSlice from '../apiSlice/slice';

export const deviceSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRememberedDevice: builder.mutation<any, void>({
      query: () => ({
        url: 'devices',
        method: 'POST'
      }),
      invalidatesTags: ['Device']
    }),
    deleteRememberedDevice: builder.mutation<any, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `device/${deviceId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Device']
    }),
    refreshDevices: builder.mutation<{ device_token: string }, void>({
      query: () => ({
        url: 'devices',
        method: 'POST',
      }),
      extraOptions: { maxRetries: 2 },
    }),
  })
});

export const {
  useAddRememberedDeviceMutation,
  useDeleteRememberedDeviceMutation,
  useRefreshDevicesMutation
} = deviceSlice;
