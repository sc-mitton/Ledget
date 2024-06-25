import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Environment = 'dev' | 'prod'

interface State {
  platform: Environment
  apiUrl: string
}

export interface RootStateWithEnvironment {
  environment: State
  [key: string]: any
}

const initialState: State = {
  platform: 'dev',
  apiUrl: ''
}

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (state, action: PayloadAction<Environment>) => {
      if (action.payload === 'dev') {
        state.platform = 'dev'
        state.apiUrl = 'https://localhost/v1/'
      } else if (action.payload === 'prod') {
        state.platform = 'prod'
        state.apiUrl = 'https://api.ledget.app/v1/'
      }
    }
  }
})

export const { setEnvironment } = environmentSlice.actions

export const selectEnvironment = (state: RootStateWithEnvironment) => state.environment.platform
export const selectApiUrl = (state: RootStateWithEnvironment) => state.environment.apiUrl

export default environmentSlice.reducer
