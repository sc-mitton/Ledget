import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateT {
  firstCardIndex?: number;
}

const initialState: StateT = {};

export const creditCardsTabSlice = createSlice({
  name: 'creditCardsTab',
  initialState,
  reducers: {
    setFirstCardIndex: (state, action: PayloadAction<number>) => {
      state.firstCardIndex = action.payload;
    },
  },
});

export const { setFirstCardIndex } = creditCardsTabSlice.actions;
export const selectFirstCardIndex = (state: { creditCardsTab: StateT }) =>
  state.creditCardsTab.firstCardIndex;
