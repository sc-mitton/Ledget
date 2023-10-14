import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ToastItem } from '@ledget/ui'


export const toastSlice = createSlice({
    name: "toast",
    initialState: {
        toast: [] as ToastItem[]
    },
    reducers: {
        popToast: (state, action: PayloadAction<ToastItem>) => {
            state.toast = [...state.toast, action.payload]

            // Remove toast after 5 seconds
            setTimeout(() => {
                const index = state.toast.findIndex((item) => item === action.payload);

                if (index !== -1) {
                    state.toast.splice(index, 1);
                }
            }, 5000)
        }
    }
})

export const { popToast } = toastSlice.actions;
