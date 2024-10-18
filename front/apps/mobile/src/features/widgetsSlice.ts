import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Single means only one instance of this widget can be present
// in the dashboard at a time
const AvailableWidgets = [
  {
    key: 'category-progress' as const,
    shape: 'square' as const,
    args: {
      category: ''
    }
  },
  {
    key: 'categories-progress' as const,
    shape: 'rectangle' as const,
    args: {
      categories: ['', '', '']
    }
  },
  {
    key: 'account-balance' as const,
    shape: 'square' as const,
    args: {
      account: ''
    }
  },
  {
    key: 'accounts-balance' as const,
    shape: 'rectangle' as const,
    args: {
      accounts: ['', '', '']
    },
  },
  {
    key: 'spending-vs-income' as const,
    shape: 'rectangle' as const,
  },
  {
    key: 'investments-balance' as const,
    shape: 'rectangle' as const,
    args: {
      accounts: ['', '', '']
    },
  },
  {
    key: 'investment-balance' as const,
    shape: 'square' as const,
    args: {
      account: ''
    }
  },
  {
    key: 'monthly-spending-left' as const,
    shape: 'square' as const,
  },
  {
    key: 'yearly-spending-left' as const,
    shape: 'square' as const,
  },
  {
    key: 'credit-card-balance' as const,
    shape: 'square' as const,
    args: {
      account: ''
    }
  },
  {
    key: 'credit-cards-balance' as const,
    shape: 'rectangle' as const,
    args: {
      accounts: ['', '', '']
    },
  }
]

const SingularWidgets = [
  'spending-vs-income',
  'monthly-spending-left',
  'yearly-spending-left',
  'investments-balance',
  'credit-cards-balance',
  'accounts-balance'
] as (typeof AvailableWidgets[number])['key'][]

export type Widget = typeof AvailableWidgets[number]

type WidgetsState = {
  currentWidgets: Widget[],
  availableWidgets: Widget[]
}

const initialState: WidgetsState = {
  currentWidgets: [],
  availableWidgets: AvailableWidgets.map(w => ({ ...w }))
}

export const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Pick<(typeof AvailableWidgets)[number], 'key' | 'args'>>) => {

      const isSingular = SingularWidgets.includes(action.payload.key)

      if (isSingular && state.currentWidgets.some(w => w.key === action.payload.key)) {
        return
      }

      // Add the widget to the widgets array
      state.currentWidgets.push({
        ...AvailableWidgets.find(w => w.key === action.payload.key),
        ...action.payload
      } as Widget)

      // Remove the widget from the available widgets if it's singular
      if (isSingular) {
        state.availableWidgets = state.availableWidgets.filter(w => w.key !== action.payload.key)
      }

    },
    removeWidget: (state, action) => {
      state.currentWidgets = state.currentWidgets.filter(w => w !== action.payload)
    }
  }
})

export const { addWidget, removeWidget } = widgetsSlice.actions

export const selectCurrentWidgets = (state: { widgets: WidgetsState }) => state.widgets.currentWidgets
export const selectAvailableWidgets = (state: { widgets: WidgetsState }) => state.widgets.availableWidgets

export default widgetsSlice.reducer
