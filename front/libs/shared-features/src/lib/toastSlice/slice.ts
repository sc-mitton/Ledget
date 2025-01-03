import {
  createSlice,
  PayloadAction,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import { NewToast, ToastItem, RootStateWithToast } from './types';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { hasErrorCode } from '@ledget/helpers';
import apiSlice from '../apiSlice/slice';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    freshToast: [] as ToastItem[],
  },
  reducers: {
    popToast: (state, action: PayloadAction<NewToast>) => {
      const newToast: ToastItem = {
        id: Math.random().toString(36).slice(2),
        timer: 5000,
        ...action.payload,
      };

      const shouldAdd = state.freshToast.every(
        (t) => t.messageId !== newToast.messageId
      );
      if (shouldAdd) {
        state.freshToast = [...state.freshToast, newToast];
      }
    },
    tossToast: (state, action: PayloadAction<string>) => {
      state.freshToast = state.freshToast.filter(
        (toast: ToastItem) => toast.id !== action.payload
      );
    },
  },
});

export const { popToast, tossToast } = toastSlice.actions;

export const toastStackSelector = (state: RootStateWithToast) =>
  state.toast.freshToast;

export const toastErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (hasErrorCode('ITEM_LOGIN_REQUIRED', action.payload)) {
        api.dispatch(
          popToast({
            message: `Account connection broken`,
            messageId: 'toast-connection-broken',
            actionLink: [
              'BottomTabs',
              { screen: 'Profile', params: { screen: 'Connections' } },
            ],
            actionMessage: 'Reconnect',
            type: 'error',
            timer: 7000,
          })
        );
        apiSlice.util.invalidateTags(['PlaidItem']);
      }
    }

    return next(action);
  };
