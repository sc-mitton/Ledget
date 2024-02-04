import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { authSlice } from '@features/authSlice'
import { toastSlice } from '@features/toastSlice'
import { extendedApiSlice as categorySlice } from './categorySlice'
import { extendedApiSlice as billSlice } from './billSlice'
import { confirmStack, filteredFetchedConfirmedTransactions } from './transactionsSlice'
import { uiSlice } from './uiSlice'
import { modalSlice } from './modalSlice'
import { budgetItemMetaDataSlice } from './budgetItemMetaDataSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    toast: toastSlice.reducer,
    categories: categorySlice.reducer,
    bills: billSlice.reducer,
    confirmStack: confirmStack.reducer,
    filteredFetchedonfirmedTransactions: filteredFetchedConfirmedTransactions.reducer,
    modal: modalSlice.reducer,
    budgetItemMetaData: budgetItemMetaDataSlice.reducer
})

export default rootReducer
