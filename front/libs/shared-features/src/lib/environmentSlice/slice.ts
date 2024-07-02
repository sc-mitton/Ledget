import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EnvironmentName = 'dev' | 'prod'

interface State {
  name?: EnvironmentName
  apiUrl: string
}

export interface RootStateWithEnvironment {
  environment: State
  [key: string]: any
}

const initialState: State = {
  name: undefined,
  apiUrl: ''
}

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (state, action: PayloadAction<EnvironmentName>) => {
      if (action.payload === 'dev') {
        state.name = 'dev'
        state.apiUrl = 'https://localhost/v1'
      } else if (action.payload === 'prod') {
        state.name = 'prod'
        state.apiUrl = 'https://api.ledget.app/v1'
      }
    }
  }
})

export const { setEnvironment } = environmentSlice.actions

export const selectEnvironment = (state: RootStateWithEnvironment) => state.environment.name
export const selectApiUrl = (state: RootStateWithEnvironment) => state.environment.apiUrl

export default environmentSlice.reducer
