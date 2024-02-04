import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from '@hooks/store';
import { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    notificationsTabIndex?: number
    budgetItemsSort?: 'alpha-asc' | 'alpha-des' | 'amount-asc' | 'amount-des' | 'default'
}

const initialState: UiState = {
    notificationsTabIndex: 0,
    budgetItemsSort: 'default',
}


export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setNotificationsTabIndex: (state, action: PayloadAction<number>) => {
            state.notificationsTabIndex = action.payload;
        },
        setBudgetItemsSort: (state, action: PayloadAction<UiState['budgetItemsSort']>) => {
            state.budgetItemsSort = action.payload;
        },

    },

})

export const selectBudgetItemsSort = (state: RootState) => state.ui.budgetItemsSort;
export const selectNotificationsTabIndex = (state: RootState) => state.ui.notificationsTabIndex;

export const {
    setNotificationsTabIndex,
    setBudgetItemsSort,
} = uiSlice.actions
