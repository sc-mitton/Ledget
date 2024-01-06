import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { authSlice } from '@features/authSlice'
import { toastSlice } from '@features/toastSlice'
import { categorySlice } from './categorySlice'
import { billSlice } from './billSlice'
import { confirmStack, filteredFetchedConfirmedTransactions } from './transactionsSlice'
import { uiSlice } from './uiSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    toast: toastSlice.reducer,
    categories: categorySlice.reducer,
    bills: billSlice.reducer,
    confirmStack: confirmStack.reducer,
    filteredFetchedonfirmedTransactions: filteredFetchedConfirmedTransactions.reducer,
})

export default rootReducer
