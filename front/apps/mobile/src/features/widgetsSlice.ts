import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const widgetTypes = [
  'categories-progress',
  'accounts-balance',
  'spending-vs-income',
  'investments-balance',
  'monthly-spending-left',
  'yearly-spending-left',
  'credit-cards-balance'
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
    addWidget: (state, action: PayloadAction<{ widget: Omit<Widget, 'id'>, index?: number }>) => {
      if (action.payload.index === undefined) {
        state.push({ ...action.payload.widget, id: Math.random().toString(36).substring(7) })
      } else {
        state.splice(
          action.payload.index,
          0,
          { ...action.payload.widget, id: Math.random().toString(36).substring(7) }
        )
      }
    },
    moveWidget: (state, action: PayloadAction<{ widget: Widget, index: number }>) => {
      const widgetIndex = state.findIndex(w => w.id === action.payload.widget.id)
      state.splice(widgetIndex, 1)
      state.splice(action.payload.index, 0, action.payload.widget)
    },
    removeWidget: (state, action: PayloadAction<Widget>) => {
      const index = state.findIndex(w => w.id === action.payload.id)
      state.splice(index, 1)
    }
  }
})

export const { addWidget, removeWidget, moveWidget } = widgetsSlice.actions

export const selectWidgets = (state: { widgets: WidgetsState }) => state.widgets

export default widgetsSlice.reducer
