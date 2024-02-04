import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./transactionsSlice"
import { Category } from "./categorySlice";


interface InitialState {
    transactionModal: {
        item?: Transaction
        splitMode?: boolean
    }
    categoryModal: {
        category?: Category
    }
}

const initialState: InitialState = {
    transactionModal: {},
    categoryModal: {},
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
    },
})



export const selectTransactionModal = (state: RootState) => state.modal.transactionModal;
export const selectTransactionModalItem = (state: RootState) => state.modal.transactionModal.item;
export const selectCategoryModal = (state: RootState) => state.modal.categoryModal;

export const { setTransactionModal, clearTransactionModal, setCategoryModal, clearCategoryModal } = modalSlice.actions;

export default modalSlice.reducer;
