import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ToastItem, NewToast } from '@ledget/ui'


export const toastSlice = createSlice({
    name: "toast",
    initialState: {
        freshToast: [] as ToastItem[]
    },
    reducers: {
        popToast: (state, action: PayloadAction<NewToast>) => {
            const newToast: ToastItem = {
                id: Math.random().toString(36).slice(2),
                ...action.payload
            };
            state.freshToast = [...state.freshToast, newToast]
        },
        tossToast: (state, action: PayloadAction<string>) => {
            state.freshToast = state.freshToast.filter((toast) => toast.id !== action.payload)
        }
    }
})

export const { popToast } = toastSlice.actions;
export const { tossToast } = toastSlice.actions;

export const toastStackSelector = (state: any) => state.toast.freshToast;
