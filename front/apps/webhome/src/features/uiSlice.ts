import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '@hooks/store';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        spendingSideBarCollapsed: false,
    },
    reducers: {
        toggleSpendingSideBar: (state) => {
            state.spendingSideBarCollapsed = !state.spendingSideBarCollapsed
        },
    },
})

export const { toggleSpendingSideBar } = uiSlice.actions

export const selectSpendingSideBarCollapsed = (state: RootState) => state.ui.spendingSideBarCollapsed
