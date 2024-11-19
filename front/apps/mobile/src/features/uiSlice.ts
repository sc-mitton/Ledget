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
  accountsTab: {
    selectedDepositsAccounts?: Account[]
    selectedCreditAccounts?: Account[]
  },
  settings: {
    startOnHome: boolean
  },
  lastTab: number,
  hideBottomTabs: boolean
}

const initialState: State = {
  billCatSort: 'default',
  investmentsScreen: {
    window: {
      period: 'month',
      amount: 3
    }
  },
  accountsTab: {},
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
    setAccountsTabDepositAccounts: (state, action: PayloadAction<State['accountsTab']['selectedDepositsAccounts']>) => {
      if (!state.accountsTab) state.accountsTab = {}
      state.accountsTab.selectedDepositsAccounts = action.payload
    },
    setAccountsTabCreditAccounts: (state, action: PayloadAction<State['accountsTab']['selectedDepositsAccounts']>) => {
      if (!state.accountsTab) state.accountsTab = {}
      state.accountsTab.selectedCreditAccounts = action.payload
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
  setAccountsTabDepositAccounts,
  setAccountsTabCreditAccounts,
  setInvestmentsScreenWindow,
  pinHolding,
  unPinHolding,
  updateSetting,
  updateLastTab,
  hideBottomTabs
} = uiSlice.actions

export const selectBillCatSort = (state: { ui: State }) => state.ui.billCatSort
export const selectInvestmentsScreenAccounts = (state: { ui: State }) => state.ui.investmentsScreen?.selectedAccounts
export const selectAccountsTabDepositAccounts = (state: { ui: State }) => state.ui.accountsTab?.selectedDepositsAccounts
export const selectAccountsTabCreditAccounts = (state: { ui: State }) => state.ui.accountsTab?.selectedCreditAccounts
export const selectInvestmentsScreenWindow = (state: { ui: State }) => state.ui.investmentsScreen?.window
export const selectPinnedHoldings = (state: { ui: State }) => state.ui.investmentsScreen?.pinnedHoldings
export const selectSettings = (state: { ui: State }) => state.ui.settings
export const selectLastTab = (state: { ui: State }) => state.ui.lastTab
export const selectHideBottomTabs = (state: { ui: State }) => state.ui.hideBottomTabs
