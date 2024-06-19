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
    })
  })
});

export const {
  useAddRememberedDeviceMutation,
  useDeleteRememberedDeviceMutation
} = deviceSlice;
