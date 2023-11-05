import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { authSlice } from '@features/authSlice'
import { toastSlice } from '@features/toastSlice'
import { categorySlice } from './categorySlice'
import { billSlice } from './billSlice'
import { confirmStack } from './transactionsSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    toast: toastSlice.reducer,
    categories: categorySlice.reducer,
    bills: billSlice.reducer,
    confirmStack: confirmStack.reducer
})

export default rootReducer
