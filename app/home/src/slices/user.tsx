import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ledget } from '../api/ledget'

export const initialState = {
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
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

// Thunk function
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    try {
        const response = await ledget.get('/user/me')
        return response.data
    } catch (error) {
        return error.response.data
    }
})

// Slices
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.status = 'succeeded'
                state.email = payload.email
                state.name = payload.name
                state.is_customer = payload.is_customer
                state.verified = payload.verified
                state.subscription = payload.subscription
            })
            .addCase(fetchUser.rejected, (state, { payload }) => {
                state.status = 'failed'
            })
    }
})

export const { } = userSlice.actions
export default userSlice.reducer

// Selectors - This is how we pull information from the Global store slice
export const selectUser = (state) => state.user
