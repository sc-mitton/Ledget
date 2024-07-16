import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EnvironmentName = 'dev' | 'prod'
type Platform = 'browser' | 'mobile'

interface State {
  name?: EnvironmentName
  platform?: Platform
  sessionToken?: string
  deviceToken?: string
  apiUrl: string
}

export interface RootStateWithEnvironment {
  environment: State
  [key: string]: any
}

const initialState: State = {
  name: undefined,
  apiUrl: '',
  platform: undefined,
  sessionToken: undefined,
  deviceToken: undefined
}

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (state, action: PayloadAction<{ name: EnvironmentName, apiUrl: string, platform: Platform }>) => {
      state.name = action.payload.name
      state.apiUrl = action.payload.apiUrl
      state.platform = action.payload.platform
    },
    setSessionToken: (state, action: PayloadAction<string>) => {
      state.sessionToken = action.payload
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload
    }
  }
})

export const { setEnvironment, setSessionToken } = environmentSlice.actions

export const selectEnvironment = (state: RootStateWithEnvironment) => state.environment.name
export const selectApiUrl = (state: RootStateWithEnvironment) => state.environment.apiUrl
export const selectPlatform = (state: RootStateWithEnvironment) => state.environment.platform
export const selectSessionToken = (state: RootStateWithEnvironment) => state.environment.sessionToken
export const selectDeviceToken = (state: RootStateWithEnvironment) => state.environment.deviceToken

export default environmentSlice.reducer
