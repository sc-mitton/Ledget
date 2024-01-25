import { apiSlice } from '@api/apiSlice'
import { createSlice } from "@reduxjs/toolkit";
import { User, extendedApiSlice as userExtendedApiSlice } from '@features/userSlice'
import { RootState } from '@hooks/store';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        reAuthed: {
            level: 'none' as User['session_aal'],
            at: null as number | null
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
            userExtendedApiSlice.endpoints.getMe.matchFulfilled,
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
        addRememberedDevice: builder.mutation<any, void>({
            query: () => ({
                url: 'devices',
                method: 'POST',
            }),
            invalidatesTags: ['Device'],
        }),
        deleteRememberedDevice: builder.mutation<any, { deviceId: string }>({
            query: ({ deviceId }) => ({
                url: `device/${deviceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Device'],
        })
    })
})

export const { aal1ReAuthed, aal15ReAuthed, aal2ReAuthed } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectSessionIsFreshAal1 = (state: RootState) => {
    const isFresh = state.auth.reAuthed.at && Date.now() - state.auth.reAuthed.at < 1000 * 60 * 9
    const aalGood = ['aal1', 'aal15', 'aal2'].includes(state.auth.reAuthed.level)
    return isFresh && aalGood
}

export const {
    useAddRememberedDeviceMutation,
    useDeleteRememberedDeviceMutation
} = extendedApiSlice
