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
    }
}

const initialState: InitialState = {
    transactionModal: {},
    categoryModal: {},
    billModal: {},
    reAuthModal: { open: false }
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
        }
    },
})



export const selectTransactionModal = (state: RootState) => state.modal.transactionModal;
export const selectTransactionModalItem = (state: RootState) => state.modal.transactionModal.item;
export const selectCategoryModal = (state: RootState) => state.modal.categoryModal;
export const selectBillModal = (state: RootState) => state.modal.billModal;
export const selectReAuthModal = (state: RootState) => state.modal.reAuthModal.open;

export const {
    setTransactionModal,
    clearTransactionModal,
    setCategoryModal,
    clearCategoryModal,
    setBillModal,
    clearBillModal,
    setReAuthModal
} = modalSlice.actions;

export default modalSlice.reducer;
