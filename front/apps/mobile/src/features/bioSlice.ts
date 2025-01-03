import { createSlice } from '@reduxjs/toolkit';

type TBioSliceState = {
  last_authed: number;
};

const initialState: TBioSliceState = {
  last_authed: 0,
};

export const bioSlice = createSlice({
  name: 'bio',
  initialState,
  reducers: {
    setLastAuthed: (state, action) => {
      state.last_authed = action.payload;
    },
  },
});

export const { setLastAuthed } = bioSlice.actions;

export const selectLastAuthed = (state: {
  bio: TBioSliceState;
  [key: string]: any;
}) => state.bio.last_authed;
