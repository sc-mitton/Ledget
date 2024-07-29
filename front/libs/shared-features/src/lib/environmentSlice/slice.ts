import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EnvironmentName = 'dev' | 'prod'
type Platform = 'browser' | 'mobile'

interface Session { id: string, token: string }

interface State {
  name?: EnvironmentName
  platform?: Platform
  session?: Session,
  deviceToken?: string,
  apiUrl?: string
}

export interface RootStateWithEnvironment {
  environment: State
  [key: string]: any
}

const initialState: State = {
  name: undefined,
  apiUrl: undefined,
  platform: undefined,
  session: undefined,
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
    setSession: (state, action: PayloadAction<Session | undefined>) => {
      state.session = action.payload
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload
    }
  }
})

export const { setEnvironment, setSession, setDeviceToken } = environmentSlice.actions

export const selectEnvironment = (state: RootStateWithEnvironment) => state.environment.name
export const selectApiUrl = (state: RootStateWithEnvironment) => state.environment.apiUrl
export const selectPlatform = (state: RootStateWithEnvironment) => state.environment.platform
export const selectSessionToken = (state: RootStateWithEnvironment) => state.environment.session?.token
export const selectSessionId = (state: RootStateWithEnvironment) => state.environment.session?.id
export const selectSession = (state: RootStateWithEnvironment) => state.environment.session
export const selectDeviceToken = (state: RootStateWithEnvironment) => state.environment.deviceToken

export default environmentSlice.reducer
