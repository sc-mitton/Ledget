import { combineReducers } from 'redux'
import { apiSlice, userSlice, environmentSlice } from '@ledget/shared-features'
import { pricesSlice } from './pricesSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userSlice.reducer,
    environment: environmentSlice.reducer,
    prices: pricesSlice.reducer
})

export default rootReducer
