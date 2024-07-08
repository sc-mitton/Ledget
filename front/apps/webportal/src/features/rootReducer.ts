import { combineReducers } from 'redux'
import {
    apiSlice,
    userSlice,
    environmentSlice,
    deviceSlice
} from '@ledget/shared-features'
import { pricesSlice } from './pricesSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    device: deviceSlice.reducer,
    user: userSlice.reducer,
    environment: environmentSlice.reducer,
    prices: pricesSlice.reducer
})

export default rootReducer
