import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./transactionsSlice"
import { Category } from "./categorySlice";

interface UiState {
    budgetMonth?: number
    budgetYear?: number
    transactionModal: {
        item?: Transaction
        splitMode?: boolean
    }
    categoryModal: {
        category?: Category
    }
    notificationsTabIndex?: number
}

const initialState: UiState = {
    budgetMonth: undefined,
    budgetYear: undefined,
    transactionModal: {
        item: undefined,
        splitMode: false
    },
    categoryModal: {
        category: undefined,
    },
    notificationsTabIndex: undefined
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        changeBudgetMonthYear: (state, action: PayloadAction<{ month: number, year: number }>) => {
            state.budgetMonth = action.payload.month;
            state.budgetYear = action.payload.year;
        },
        setTransactionModal: (state, action: PayloadAction<{ item: Transaction, splitMode?: boolean }>) => {
            state.transactionModal.item = action.payload.item;
            state.transactionModal.splitMode = action.payload.splitMode;
        },
        clearTransactionModal: (state) => {
            state.transactionModal.item = undefined;
            state.transactionModal.splitMode = false;
        },
        setNotificationsTabIndex: (state, action: PayloadAction<number>) => {
            state.notificationsTabIndex = action.payload;
        },
        setCategoryModal: (state, action: PayloadAction<{ category: Category }>) => {
            state.categoryModal.category = action.payload.category;
        },
        clearCategoryModal: (state) => {
            state.categoryModal.category = undefined;
        },
    },
})

const selectMonth = (state: RootState) => state.ui.budgetMonth;
const selectYear = (state: RootState) => state.ui.budgetYear;

export const selectBudgetMonthYear = createSelector(
    [selectMonth, selectYear],
    (month, year) => ({ month, year })
)

export const selectNotificationsTabIndex = (state: RootState) => state.ui.notificationsTabIndex;
export const selectTransactionModal = (state: RootState) => state.ui.transactionModal;
export const selectTransactionModalItem = (state: RootState) => state.ui.transactionModal.item;
export const selectCategoryModal = (state: RootState) => state.ui.categoryModal;

export const {
    changeBudgetMonthYear,
    setTransactionModal,
    clearTransactionModal,
    setNotificationsTabIndex,
    clearCategoryModal,
    setCategoryModal
} = uiSlice.actions
