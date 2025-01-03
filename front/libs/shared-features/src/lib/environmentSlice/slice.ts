import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EnvironmentName = 'dev' | 'prod';
type Platform = 'browser' | 'mobile';

type State = {
  name?: EnvironmentName;
  platform?: Platform;
  apiUrl?: string;
};

export type RootStateWithEnvironment = {
  environment: State;
  [key: string]: any;
};

const initialState: State = {
  name: undefined,
  apiUrl: undefined,
  platform: undefined,
};

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setEnvironment: (
      state,
      action: PayloadAction<{
        name: EnvironmentName;
        apiUrl: string;
        platform: Platform;
      }>
    ) => {
      state.name = action.payload.name;
      state.apiUrl = action.payload.apiUrl;
      state.platform = action.payload.platform;
    },
  },
});

export const { setEnvironment } = environmentSlice.actions;

export const selectEnvironment = (state: RootStateWithEnvironment) =>
  state.environment.name;
export const selectApiUrl = (state: RootStateWithEnvironment) =>
  state.environment.apiUrl;
export const selectPlatform = (state: RootStateWithEnvironment) =>
  state.environment.platform;

export default environmentSlice.reducer;
