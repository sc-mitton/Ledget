import { createSlice } from '@reduxjs/toolkit'
import { ledget } from '../api/ledget'

export const initialState = {
    loading: false,
    hasErrors: false,
    email: '',
    name: {
        first: '',
        last: '',
    },
    is_customer: false,
    verified: false,
    subscription: {
        nickname: '',
        status: '',
        current_period_end: 0,
        amount: 0,
    }
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser: (state) => {
            state.loading = true
        },
        getUserSuccess: (state, { payload }) => {
            state.email = payload.email
            state.name = payload.name
            state.is_customer = payload.is_customer
            state.verified = payload.verified
            state.subscription = payload.subscription
            state.loading = false
            state.hasErrors = false
        },
        getUserFailure: (state) => {
            state.loading = false
            state.hasErrors = true
        },
        updateUser: (state) => {
            state.loading = true
        }
    },
})

export const { getUser, getUserSuccess, getUserFailure, updateUser } = userSlice.actions

export const userSelector = (state) => state.user

export default userSlice.reducer

export function fetchUser() {
    return async (dispatch) => {
        dispatch(getUser())

        try {
            ledget.get('/user/me').
                then((response) => {
                    dispatch(getUserSuccess(response.data))
                }
                )
        } catch (error) {
            dispatch(getUserFailure())
        }
    }
}
