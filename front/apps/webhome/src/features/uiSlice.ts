import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@hooks/store';
import { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  notificationsTabIndex?: number;
}

const initialState: UiState = {
  notificationsTabIndex: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotificationsTabIndex: (state, action: PayloadAction<number>) => {
      state.notificationsTabIndex = action.payload;
    },
  },
});

export const selectNotificationsTabIndex = (state: RootState) =>
  state.ui.notificationsTabIndex;

export const { setNotificationsTabIndex } = uiSlice.actions;
