import { combineReducers } from '@reduxjs/toolkit'

import { apiSlice } from '@api/apiSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer
})

export default rootReducer
