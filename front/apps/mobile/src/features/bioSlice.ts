import { createSlice } from "@reduxjs/toolkit";

interface TState {
  last_authed: number;
}

const initialState: TState = {
  last_authed: 0,
};

export const bioSlice = createSlice({
  name: "bio",
  initialState,
  reducers: {
    setLastAuthed: (state, action) => {
      state.last_authed = action.payload;
    },
  },
});

export const { setLastAuthed } = bioSlice.actions;

export const selectLastAuthed = (state: { bio: TState, [key: string]: any }) => state.bio.last_authed;
