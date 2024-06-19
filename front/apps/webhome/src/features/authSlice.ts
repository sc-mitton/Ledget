import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@hooks/store';
import { userSlice, User } from '@ledget/shared-features';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    reAuthed: {
      level: 'none' as User['session']['aal'],
      at: null as number | null
    }
  },
  reducers: {
    aal1ReAuthed: (state) => {
      state.reAuthed = {
        level: 'aal1',
        at: Date.now()
      };
    },
    aal15ReAuthed: (state) => {
      state.reAuthed = {
        level: 'aal15',
        at: Date.now()
      };
    },
    aal2ReAuthed: (state) => {
      state.reAuthed = {
        level: 'aal2',
        at: Date.now()
      };
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userSlice.endpoints.getMe.matchFulfilled,
      (state, action) => {
        if (
          Date.now() - Date.parse(action.payload?.last_login) <
          1000 * 60 * 9
        ) {
          state.reAuthed.level = action.payload?.session?.aal || 'none';
          state.reAuthed.at = Date.now();
        }
      }
    );
  }
});

export const { aal1ReAuthed, aal15ReAuthed, aal2ReAuthed } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectSessionIsFreshAal1 = (state: RootState) => {
  const isFresh =
    state.auth.reAuthed.at &&
    Date.now() - state.auth.reAuthed.at < 1000 * 60 * 9;
  const aalGood = ['aal1', 'aal15', 'aal2'].includes(state.auth.reAuthed.level);
  return isFresh && aalGood;
};
