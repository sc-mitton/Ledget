import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Session = { id: string; token: string };

type MobileAuthSliceStateT = {
  session?: Session;
  deviceToken?: string;
};

export type RootStateWithMobileAuth = {
  mobileAuth: MobileAuthSliceStateT;
  [key: string]: any;
};

const initialState: MobileAuthSliceStateT = {
  session: undefined,
  deviceToken: undefined,
};

export const mobileAuthSlice = createSlice({
  name: 'mobileAuth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | undefined>) => {
      state.session = action.payload;
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload;
    },
  },
});

export const { setSession, setDeviceToken } = mobileAuthSlice.actions;

export const selectSessionToken = (state: RootStateWithMobileAuth) =>
  state.mobileAuth.session?.token;
export const selectSessionId = (state: RootStateWithMobileAuth) =>
  state.mobileAuth.session?.id;
export const selectSession = (state: RootStateWithMobileAuth) =>
  state.mobileAuth.session;
export const selectDeviceToken = (state: RootStateWithMobileAuth) =>
  state.mobileAuth.deviceToken;
