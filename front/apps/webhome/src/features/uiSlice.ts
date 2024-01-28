import { createSlice } from "@reduxjs/toolkit";
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

export const selectBudgetMonthYear = (state: RootState) => ({
    month: state.ui.budgetMonth,
    year: state.ui.budgetYear,
})

export const { changeBudgetMonthYear } = uiSlice.actions
