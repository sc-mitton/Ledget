import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewToast, ToastItem, RootStateWithToast } from './types';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    freshToast: [] as ToastItem[]
  },
  reducers: {
    popToast: (state, action: PayloadAction<NewToast>) => {
      const newToast: ToastItem = {
        id: Math.random().toString(36).slice(2),
        timer: 5000,
        ...action.payload
      };
      if (!state.freshToast.includes(newToast)) {
        state.freshToast = [...state.freshToast, newToast]
      };
    },
    tossToast: (state, action: PayloadAction<string>) => {
      state.freshToast = state.freshToast.filter(
        (toast: ToastItem) => toast.id !== action.payload
      );
    }
  }
});

export const { popToast } = toastSlice.actions;
export const { tossToast } = toastSlice.actions;

export const toastStackSelector = (state: RootStateWithToast) =>
  state.toast.freshToast;
