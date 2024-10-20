import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const widgetTypes = [
  'categories-progress',
  'accounts-balance',
  'spending-vs-income',
  'investments-balance',
  'monthly-spending-left',
  'yearly-spending-left',
  'credit-cards-balance',
  'sample1',
  'sample2',
  'sample3'
] as const

export type Widget = {
  id?: string
  shape: 'rectangle' | 'square'
  type: (typeof widgetTypes)[number]
  args?: any
}


type WidgetsState = Widget[]

const initialState: WidgetsState = []

export const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Omit<Widget, 'id'>>) => {
      state.push({ ...action.payload, id: Math.random().toString(36).substring(7) })
    },
    reorderWidget: (state, action: PayloadAction<Widget & { index: number }>) => {
      const widgetIndex = state.findIndex(w => w.id === action.payload.id)
      state = [
        ...state.slice(0, widgetIndex),
        action.payload,
        ...state.slice(widgetIndex + 1)
      ]
    },
    removeWidget: (state, action: PayloadAction<Widget>) => {
      state = state.filter(w => w.id !== action.payload.id)
    }
  }
})

export const { addWidget, removeWidget } = widgetsSlice.actions

export const selectWidgets = (state: { widgets: WidgetsState }) => state.widgets

export default widgetsSlice.reducer
