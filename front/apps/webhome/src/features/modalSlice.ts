import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./transactionsSlice"
import { Category } from "./categorySlice";
import { TransformedBill } from "./billSlice";

interface InitialState {
    transactionModal: {
        item?: Transaction
        splitMode?: boolean
    }
    categoryModal: {
        category?: Category
    }
    billModal: {
        bill?: TransformedBill
    }
    reAuthModal: {
        open: boolean
    },
    logoutModal: {
        open: boolean
        fromTimeout?: boolean
        logoutTimerEnd?: number
    },
    helpModal: {
        open: boolean
    }
}

const initialState: InitialState = {
    transactionModal: {},
    categoryModal: {},
    billModal: {},
    reAuthModal: { open: false },
    logoutModal: { open: false, logoutTimerEnd: new Date().getTime() + (Number(import.meta.env.VITE_AUTOMATIC_LOGOUT_LENGTH) * 1000) },
    helpModal: { open: false }
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setTransactionModal: (state, action: PayloadAction<{ item: Transaction, splitMode?: boolean }>) => {
            state.transactionModal.item = action.payload.item;
            state.transactionModal.splitMode = action.payload.splitMode;
        },
        clearTransactionModal: (state) => {
            state.transactionModal.item = undefined;
            state.transactionModal.splitMode = false;
        },
        setCategoryModal: (state, action: PayloadAction<{ category: Category }>) => {
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
        setReAuthModal: (state, action: PayloadAction<{ open: boolean }>) => {
            state.reAuthModal.open = action.payload.open;
        },
        setLogoutModal: (state, action: PayloadAction<{ open: boolean, fromTimeout?: boolean }>) => {
            state.logoutModal.open = action.payload.open;
            state.logoutModal.fromTimeout = action.payload.fromTimeout;
        },
        clearLogoutModal: (state) => {
            state.logoutModal.open = false;
        },
        refreshLogoutTimer: (state) => {
            state.logoutModal.logoutTimerEnd = new Date().getTime() + (Number(import.meta.env.VITE_AUTOMATIC_LOGOUT_LENGTH) * 1000);
        },
        setHelpModal: (state, action: PayloadAction<{ open: boolean }>) => {
            state.helpModal.open = action.payload.open;
        },
        clearHelpModal: (state) => {
            state.helpModal.open = false;
        }
    },
})

export const selectTransactionModal = (state: RootState) => state.modal.transactionModal;
export const selectTransactionModalItem = (state: RootState) => state.modal.transactionModal.item;
export const selectCategoryModal = (state: RootState) => state.modal.categoryModal;
export const selectBillModal = (state: RootState) => state.modal.billModal;
export const selectReAuthModal = (state: RootState) => state.modal.reAuthModal.open;
export const selectLogoutModal = (state: RootState) => state.modal.logoutModal;
export const selectHelpModal = (state: RootState) => state.modal.helpModal;

export const {
    setTransactionModal,
    clearTransactionModal,
    setCategoryModal,
    clearCategoryModal,
    setBillModal,
    clearBillModal,
    setReAuthModal,
    setLogoutModal,
    clearLogoutModal,
    setHelpModal,
    clearHelpModal,
    refreshLogoutTimer
} = modalSlice.actions;

export default modalSlice.reducer;
