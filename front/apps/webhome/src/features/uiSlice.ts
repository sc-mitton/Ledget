import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./transactionsSlice";

interface UiState {
    budgetMonth?: number
    budgetYear?: number
    transactionModal: {
        item?: Transaction
        splitMode?: boolean
    }
}

const initialState: UiState = {
    budgetMonth: undefined,
    budgetYear: undefined,
    transactionModal: {
        item: undefined,
        splitMode: false
    }
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
        }
    },
})

const selectMonth = (state: RootState) => state.ui.budgetMonth;
const selectYear = (state: RootState) => state.ui.budgetYear;

export const selectBudgetMonthYear = createSelector(
    [selectMonth, selectYear],
    (month, year) => ({ month, year })
)

export const selectTransactionModal = (state: RootState) => state.ui.transactionModal;

export const { changeBudgetMonthYear, setTransactionModal, clearTransactionModal } = uiSlice.actions
