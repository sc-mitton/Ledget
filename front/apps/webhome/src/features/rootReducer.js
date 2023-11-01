import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { authSlice } from '@features/authSlice'
import { toastSlice } from '@features/toastSlice'
import { confirmedTransactionBufferSlice } from '@features/confirmedTransactionBufferSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    toast: toastSlice.reducer,
    confirmedBuffer: confirmedTransactionBufferSlice.reducer,
})

export default rootReducer
