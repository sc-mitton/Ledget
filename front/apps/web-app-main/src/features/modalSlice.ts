import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@hooks/store';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  Transaction,
  Category,
  TransformedBill,
  InvestmentTransaction,
  Account,
} from '@ledget/shared-features';

interface ModalTypes {
  transaction: {
    item: Transaction;
    splitMode?: boolean;
  };
  investmentTransaction: {
    item: InvestmentTransaction;
  };
  category: {
    category: Category;
  };
  reAuth: undefined;
  help: undefined;
  editCategories: undefined;
  pinAccounts: undefined;
  bill: {
    bill: TransformedBill;
  };
  logout: {
    fromTimeout: boolean;
  };
  holdings: undefined;
  changeCardColor: {
    card: Account;
  };
}

type StateT<T> = T extends keyof ModalTypes
  ? ModalTypes[T] extends undefined
    ? { name: T }
    : {
        name: T;
        args: ModalTypes[T] extends undefined ? undefined : ModalTypes[T];
      }
  : {};

const initialState = {} as StateT<keyof ModalTypes>;

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (
      state,
      action: PayloadAction<StateT<keyof ModalTypes> | undefined>
    ) => {
      return action.payload
        ? { ...state, ...action.payload }
        : ({} as StateT<keyof ModalTypes>);
    },
  },
});

export const selectModal = (state: RootState) => state.modal;

export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
