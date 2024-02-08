import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { pricesSlice } from './pricesSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    prices: pricesSlice.reducer
})

export default rootReducer
