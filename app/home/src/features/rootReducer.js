import { combineReducers } from 'redux'

import { ledgetSlice } from '@api/apiSlice'

const rootReducer = combineReducers({
    [ledgetSlice.reducerPath]: ledgetSlice.reducer
})

export default rootReducer
