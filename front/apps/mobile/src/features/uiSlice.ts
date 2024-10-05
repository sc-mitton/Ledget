import { createSlice } from "@reduxjs/toolkit";

type State = {
  billCatSort?: 'amountDesc' | 'amountAsc' | 'nameDesc' | 'nameAsc' | 'default'
}

const initialState: State = {
  billCatSort: 'default'
}

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    setBillCatSort: (state, action) => {
      state.billCatSort = action.payload
    }
  }
})

export const { setBillCatSort } = uiSlice.actions

export const selectBillCatSort = (state: { ui: State }) => state.ui.billCatSort
