import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    budgetMonth?: number
    budgetYear?: number
}

const initialState: UiState = {
    budgetMonth: undefined,
    budgetYear: undefined,
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        changeBudgetMonthYear: (state, action: PayloadAction<{ month: number, year: number }>) => {
            state.budgetMonth = action.payload.month;
            state.budgetYear = action.payload.year;
        }
    },
})

const selectMonth = (state: RootState) => state.ui.budgetMonth;
const selectYear = (state: RootState) => state.ui.budgetYear;

export const selectBudgetMonthYear = createSelector(
    [selectMonth, selectYear],
    (month, year) => ({ month, year })
)

export const { changeBudgetMonthYear } = uiSlice.actions
