import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from '@features/transactionsSlice'
import { useUpdateTransactionMutation } from '@features/transactionsSlice'

export const confirmedTransactionBufferSlice = createSlice({
    name: "confirmedBuffer",
    initialState: {
        confirmed: [] as Transaction[],
    },
    reducers: {
        addConfirmedTransaction: (state, action: PayloadAction<Transaction>) => {
            state.confirmed.push(action.payload)
        },
        clearConfirmedTransactions: (state) => {
            state.confirmed = []
            // invalidate the transactions tag
            // post the transactions mutation for the list
        },
    },
})

export const {
    addConfirmedTransaction,
    clearConfirmedTransactions
} = confirmedTransactionBufferSlice.actions

