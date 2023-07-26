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

// Slices
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
export default userSlice.reducer

// Thunk function
export const fetchUser = () => (dispatch) => {
    setTimeout(() => {
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
    }, 0)
}

// Selectors - This is how we pull information from the Global store slice
export const selectUser = (state) => state.user
