import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const AUTH_FRESHNESS_THRESHOLD = 1000 * 60 * 60 * 24 * 7;

type AuthSliceStateT = {
  last_authed_at: number;
  authIsFresh: boolean;
};

const initialState: AuthSliceStateT = {
  last_authed_at: 0,
  authIsFresh: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateIsAuthed: (state, action: PayloadAction<void>) => {
      state.last_authed_at = Date.now();
    },
  },
});

export const { updateIsAuthed } = authSlice.actions;

export const selectAuthIsFresh = (state: {
  auth: AuthSliceStateT;
  [key: string]: any;
}) => {
  return Date.now() - state.auth.last_authed_at < AUTH_FRESHNESS_THRESHOLD;
};

export const selectLastAuthedAt = (state: {
  auth: AuthSliceStateT;
  [key: string]: any;
}) => state.auth.last_authed_at;
