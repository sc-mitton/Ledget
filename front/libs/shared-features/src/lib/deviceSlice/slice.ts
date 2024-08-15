import apiSlice from '../apiSlice/slice';
import type { Device } from './types';

export const deviceSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], void>({
      query: () => 'devices',
      providesTags: ['Device']
    }),
    addRememberedDevice: builder.mutation<any, void>({
      query: () => ({
        url: 'devices',
        method: 'POST'
      }),
      invalidatesTags: ['Device']
    }),
    removeRememberedDevice: builder.mutation<any, { deviceId: string }>({
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
  useGetDevicesQuery,
  useAddRememberedDeviceMutation,
  useRemoveRememberedDeviceMutation,
  useRefreshDevicesMutation
} = deviceSlice;
