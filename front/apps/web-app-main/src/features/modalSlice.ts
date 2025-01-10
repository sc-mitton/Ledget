import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@hooks/store';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  Transaction,
  Category,
  TransformedBill,
} from '@ledget/shared-features';

interface InitialState {
  transactionModal: {
    item?: Transaction;
    splitMode?: boolean;
  };
  categoryModal: {
    category?: Category;
  };
  modal: 'reAuth' | 'help' | 'editCategories' | undefined;
  billModal: {
    bill?: TransformedBill;
  };
  logoutModal: {
    open: boolean;
    fromTimeout?: boolean;
    logoutTimerEnd?: number;
  };
}

const initialState: InitialState = {
  transactionModal: {},
  categoryModal: {},
  billModal: {},
  modal: undefined,
  logoutModal: {
    open: false,
    logoutTimerEnd:
      new Date().getTime() +
      Number(import.meta.env.VITE_AUTOMATIC_LOGOUT_LENGTH) * 1000,
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setTransactionModal: (
      state,
      action: PayloadAction<{ item: Transaction; splitMode?: boolean }>
    ) => {
      state.transactionModal.item = action.payload.item;
      state.transactionModal.splitMode = action.payload.splitMode;
    },
    clearTransactionModal: (state) => {
      state.transactionModal.item = undefined;
      state.transactionModal.splitMode = false;
    },
    setCategoryModal: (
      state,
      action: PayloadAction<{ category: Category }>
    ) => {
      state.categoryModal.category = action.payload.category;
    },
    clearCategoryModal: (state) => {
      state.categoryModal.category = undefined;
    },
    setBillModal: (state, action: PayloadAction<{ bill: TransformedBill }>) => {
      state.billModal.bill = action.payload.bill;
    },
    clearBillModal: (state) => {
      state.billModal.bill = undefined;
    },
    setModal: (
      state,
      action: PayloadAction<'reAuth' | 'help' | 'editCategories' | undefined>
    ) => {
      state.modal = action.payload;
    },
    clearModal: (state) => {
      state.modal = undefined;
    },
    setLogoutModal: (
      state,
      action: PayloadAction<{ open: boolean; fromTimeout?: boolean }>
    ) => {
      state.logoutModal.open = action.payload.open;
      state.logoutModal.fromTimeout = action.payload.fromTimeout;
    },
    clearLogoutModal: (state) => {
      state.logoutModal.open = false;
    },
    refreshLogoutTimer: (state) => {
      state.logoutModal.logoutTimerEnd =
        new Date().getTime() +
        Number(import.meta.env.VITE_AUTOMATIC_LOGOUT_LENGTH) * 1000;
    },
  },
});

export const selectTransactionModal = (state: RootState) =>
  state.modal.transactionModal;
export const selectTransactionModalItem = (state: RootState) =>
  state.modal.transactionModal.item;
export const selectCategoryModal = (state: RootState) =>
  state.modal.categoryModal;
export const selectBillModal = (state: RootState) => state.modal.billModal;
export const selectLogoutModal = (state: RootState) => state.modal.logoutModal;
export const selectModal = (state: RootState) => state.modal.modal;

export const {
  setTransactionModal,
  clearTransactionModal,
  setCategoryModal,
  clearCategoryModal,
  setBillModal,
  clearBillModal,
  setLogoutModal,
  clearLogoutModal,
  refreshLogoutTimer,
  setModal,
  clearModal,
} = modalSlice.actions;

export default modalSlice.reducer;
