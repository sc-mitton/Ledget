import { combineReducers } from 'redux'
import { apiSlice } from '@api/apiSlice'
import { userReducer } from '@features/userSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
})

export default rootReducer
