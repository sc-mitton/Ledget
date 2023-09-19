import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer
})

export default rootReducer
