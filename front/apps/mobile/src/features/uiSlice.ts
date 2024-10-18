import { Account } from "@ledget/shared-features";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Null indicates all accounts
type State = {
  billCatSort?: 'amountDesc' | 'amountAsc' | 'nameDesc' | 'nameAsc' | 'default'
  investmentsScreen: {
    selectedAccounts?: { id: string, name: string }[]
    window?: {
      period: 'month' | 'year'
      amount: number
    },
    pinnedHoldings?: string[]
  },
  depositsScreen: {
    selectedAccounts?: Account[]
  },
  settings: {
    startOnHome: boolean
  },
  lastTab: number,
  hideBottomTabs: boolean
}

const initialState: State = {
  billCatSort: 'default',
  investmentsScreen: {},
  depositsScreen: {},
  settings: {
    startOnHome: true
  },
  lastTab: 0,
  hideBottomTabs: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setBillCatSort: (state, action) => {
      state.billCatSort = action.payload
    },
    setInvestmentsScreenAccounts: (state, action: PayloadAction<State['investmentsScreen']['selectedAccounts']>) => {
      if (!state.investmentsScreen) state.investmentsScreen = {}
      state.investmentsScreen.selectedAccounts = action.payload
    },
    setInvestmentsScreenWindow: (state, action: PayloadAction<State['investmentsScreen']['window']>) => {
      if (!state.investmentsScreen) state.investmentsScreen = {}
      state.investmentsScreen.window = action.payload
    },
    setDepositsScreenAccounts: (state, action: PayloadAction<State['depositsScreen']['selectedAccounts']>) => {
      if (!state.depositsScreen) state.depositsScreen = {}
      state.depositsScreen.selectedAccounts = action.payload
    },
    pinHolding: (state, action: PayloadAction<string>) => {
      if (!state.investmentsScreen) state.investmentsScreen = {}
      if (!state.investmentsScreen.pinnedHoldings) state.investmentsScreen.pinnedHoldings = []
      state.investmentsScreen.pinnedHoldings.push(action.payload)
    },
    unPinHolding: (state, action: PayloadAction<string>) => {
      if (!state.investmentsScreen) state.investmentsScreen = {}
      if (!state.investmentsScreen.pinnedHoldings) state.investmentsScreen.pinnedHoldings = []
      state.investmentsScreen.pinnedHoldings = state.investmentsScreen.pinnedHoldings.filter(h => h !== action.payload)
    },
    updateSetting: (state, action: PayloadAction<{ key: keyof State['settings'], value: boolean }>) => {
      state.settings[action.payload.key] = action.payload.value
    },
    updateLastTab: (state, action: PayloadAction<number>) => {
      state.lastTab = action.payload
    },
    hideBottomTabs: (state, action: PayloadAction<boolean>) => {
      state.hideBottomTabs = action.payload
    }
  }
})

export const {
  setBillCatSort,
  setInvestmentsScreenAccounts,
  setDepositsScreenAccounts,
  setInvestmentsScreenWindow,
  pinHolding,
  unPinHolding,
  updateSetting,
  updateLastTab,
  hideBottomTabs
} = uiSlice.actions

export const selectBillCatSort = (state: { ui: State }) => state.ui.billCatSort
export const selectInvestmentsScreenAccounts = (state: { ui: State }) => state.ui.investmentsScreen?.selectedAccounts
export const selectDepositsScreenAccounts = (state: { ui: State }) => state.ui.depositsScreen?.selectedAccounts
export const selectInvestmentsScreenWindow = (state: { ui: State }) => state.ui.investmentsScreen?.window
export const selectPinnedHoldings = (state: { ui: State }) => state.ui.investmentsScreen?.pinnedHoldings
export const selectSettings = (state: { ui: State }) => state.ui.settings
export const selectLastTab = (state: { ui: State }) => state.ui.lastTab
export const selectHideBottomTabs = (state: { ui: State }) => state.ui.hideBottomTabs
