import { apiSlice } from '@api/apiSlice'
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'user',
    initialState: {
        reAuthed: {
            level: 'none',
            at: null,
        }
    },
    reducers: {
        aal1ReAuthed: (state) => {
            state.reAuthed = {
                level: 'aal1',
                at: Date.now()
            }
        },
        aal15ReAuthed: (state) => {
            state.reAuthed = {
                level: 'aal15',
                at: Date.now()
            }
        },
        aal2ReAuthed: (state) => {
            state.reAuthed = {
                level: 'aal2',
                at: Date.now()
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.getMe.matchFulfilled,
            (state, action) => {
                if (Date.now() - Date.parse(action.payload?.last_login) < 1000 * 60 * 9) {
                    state.reAuthed.level = action.payload?.session_aal
                    state.reAuthed.at = Date.now()
                }
            }
        )
    }
})

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addRememberedDevice: builder.mutation({
            query: () => ({
                url: 'devices',
                method: 'POST',
            })
        }),
        deleteRememberedDevice: builder.mutation({
            query: ({ deviceId }) => ({
                url: `devices/${deviceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['devices'],
        }),
        createOtp: builder.mutation({
            query: ({ data }) => ({
                url: 'otp',
                method: 'POST',
                ...(data ? { body: data } : {})
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
    }),
})

export const { resetAuthedAt } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectSessionIsFreshAal1 = (state) => {
    const isFresh = state.reAuthed.at && Date.now() - state.reAuthed.at < 1000 * 60 * 9
    const aalGood = state.reAuthedLevel && state.reAuthedLevel >= 1
    return isFresh && aalGood
}

export const {
    useAddRememberedDeviceMutation,
    useGetDevicesQuery,
    useDeleteRememberedDeviceMutation,
    useCreateOtpMutation,
    useVerifyOtpMutation
} = extendedApiSlice
