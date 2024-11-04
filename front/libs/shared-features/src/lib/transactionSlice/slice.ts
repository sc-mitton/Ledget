import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { PartialDeep } from 'type-fest';
import dayjs from 'dayjs';

import apiSlice from '../apiSlice/slice';
import {
  TransactionsSyncResponse,
  Transaction,
  GetTransactionsResponse,
  GetTransactionsParams,
  Note,
  ConfirmTransactionParams,
  ConfirmedQueue,
  ConfirmStackInitialState,
  RootStateWithTransactions,
  TransactionsFilter,
  TransactionsFilterState,
  TransactionsSyncParams
} from './types';
import { SplitCategory } from '../categorySlice/types';
import { Bill } from '../billSlice/types';
import {
  addTransaction2Cat,
  addTransaction2Bill,
  budgetItemMetaDataSlice
} from '../budgetItemMetaDataSlice/slice';

export const transactionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    transactionsSync: builder.mutation<
      TransactionsSyncResponse,
      TransactionsSyncParams
    >({
      query: (params) => ({
        url: 'transactions/sync',
        method: 'POST',
        ...(params && { params })
      }),
      invalidatesTags: (result, error, arg) => {
        if (!result) {
          return [];
        } else if (
          result.added > 0 ||
          result.modified > 0 ||
          result.removed > 0
        ) {
          return [
            { type: 'Transaction', id: 'LIST' },
            { type: 'UnconfirmedTransaction', id: 'LIST' }
          ];
        } else {
          return [];
        }
      }
    }),
    getUnconfirmedTransactions: builder.query<
      GetTransactionsResponse,
      GetTransactionsParams
    >({
      query: (params) => ({
        url: 'transactions',
        params: { ...params, confirmed: false }
      }),
      providesTags: ['UnconfirmedTransaction'],
      // For merging in paginated responses to the cache
      // cache key needs to not include offset and limit
      serializeQueryArgs: ({ queryArgs }) => {
        const { offset, limit, ...cacheKeyArgs } = queryArgs;
        return cacheKeyArgs;
      },
      merge: (currentCache, newItems) => {
        if (currentCache.next) {
          const { results } = currentCache;
          const { results: newResults, ...newRest } = newItems;
          return {
            results: [...results, ...newResults],
            ...newRest
          };
        } else if (currentCache.results) {
          return newItems;
        }
        return currentCache;
      },
      transformResponse: (
        response: Transaction[] | GetTransactionsResponse
      ) => {
        // If response is a list
        if (Array.isArray(response)) {
          return { results: response };
        } else {
          return response;
        }
      },
      keepUnusedDataFor: 60 * 30 // 30 minutes
    }),
    getTransactions: builder.query<
      GetTransactionsResponse,
      GetTransactionsParams
    >({
      query: (params) => ({
        url: 'transactions',
        params: params
      }),
      providesTags: (result, error, arg) => {
        return result
          ? result.results.map((item) => ({
            type: 'Transaction',
            id: item.transaction_id
          }))
          : [{ type: 'Transaction', id: 'LIST' } as const];
      },
      // For merging in paginated responses to the cache
      // cache key needs to not include offset and limit
      serializeQueryArgs: ({ queryArgs }) => {
        const { offset, limit, ...cacheKeyArgs } = queryArgs;
        return cacheKeyArgs;
      },
      merge: (currentCache, newItems) => {
        if (currentCache.results) {
          const { results } = currentCache;
          const { results: newResults } = newItems;
          // dedupe
          return {
            results: [
              ...results.filter(
                (item) =>
                  !newResults.find(
                    (i) => i.transaction_id === item.transaction_id
                  )
              ),
              ...newResults.map((t) => ({ ...t, amount: 100 }))
            ]
          };
        }
        return currentCache;
      },
      transformResponse: (
        response: Transaction[] | GetTransactionsResponse
      ) => {
        // If response is a list
        if (Array.isArray(response)) {
          return { results: response };
        } else {
          return response;
        }
      },
      keepUnusedDataFor: 60 * 30 // 30 minutes
    }),
    getTransactionsCount: builder.query<
      { count: number },
      GetTransactionsParams
    >({
      query: (params) => ({
        url: 'transactions/count',
        params: params,
        providesTags: ['TransactionCount']
      })
    }),
    getMerchants: builder.query<string[], void>({
      query: () => ({
        url: 'transactions/merchants',
        params: {}
      }),
      keepUnusedDataFor: 60 * 30 // 30 minutes
    }),
    confirmTransactions: builder.mutation<any, ConfirmTransactionParams>({
      query: (data) => ({
        url: 'transactions/confirmation',
        method: 'POST',
        body: data
      }),
      invalidatesTags: (result, error, arg) => {
        const spendingHistoryTags: {
          readonly type: 'SpendingHistory';
          readonly id: string;
        }[] = [];
        arg.forEach((item) => {
          if (item.splits) {
            item.splits.forEach((split) => {
              spendingHistoryTags.push({
                type: 'SpendingHistory',
                id: split.category
              });
            });
          }
        });

        const otherTags = [
          ...arg.map(
            (item) =>
              ({ type: 'Transaction', id: item.transaction_id } as const)
          ),
          ...(arg.some((item) => item.splits)
            ? [{ type: 'Category', id: 'LIST' } as const]
            : []),
          ...(arg.some((item) => item.bill)
            ? [{ type: 'Bill', id: 'LIST' } as const]
            : [])
        ];
        return result ? [...otherTags, ...spendingHistoryTags] : otherTags;
      }
    }),
    updateTransaction: builder.mutation<
      any,
      { transactionId: string; data: PartialDeep<Transaction> }
    >({
      query: ({ transactionId, data }) => ({
        url: `transactions/${transactionId}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Transaction', id: arg.transactionId } as const
      ]
    }),
    addNote: builder.mutation<Note, { transactionId: string; text: string }>({
      query: ({ transactionId, text }) => ({
        url: `transactions/${transactionId}/note`,
        method: 'POST',
        body: { text }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Transaction', id: arg.transactionId } as const
      ]
    }),
    updateDeleteNote: builder.mutation<
      any,
      { transactionId: string; noteId: string; text?: string }
    >({
      query: ({ transactionId, noteId, text }) => ({
        url: `transactions/${transactionId}/note/${noteId}`,
        method: text ? 'PUT' : 'DELETE',
        body: { text }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Transaction', id: arg.transactionId } as const
      ]
    })
  })
});

// State Slices

export const confirmStack = createSlice({
  name: 'confirmStack',
  initialState: {
    unconfirmed: [] as Transaction[],
    confirmedQue: [] as ConfirmedQueue
  } as ConfirmStackInitialState,
  reducers: {
    confirmTransaction: (
      state,
      action: PayloadAction<Transaction['transaction_id']>
    ) => {
      const index = state.unconfirmed.findIndex((item) => item.transaction_id === action.payload);

      if (index > -1) {
        state.confirmedQue.push({ transaction: state.unconfirmed[index] });
        state.unconfirmed.splice(index, 1);
      }
    },
    updateTransaction: (state, action: PayloadAction<{ transaction: Transaction, categories?: SplitCategory[], bill?: Bill }>) => {
      if (action.payload.categories) {
        state.unconfirmed.find(
          (item) => item.transaction_id === action.payload.transaction.transaction_id
        )!.categories = action.payload.categories;
      } else if (action.payload.bill) {
        state.unconfirmed.find(
          (item) => item.transaction_id === action.payload.transaction.transaction_id
        )!.bill = action.payload.bill;
      }
    },
    removeUnconfirmedTransaction: (state, action: PayloadAction<string>) => {
      const index = state.unconfirmed.findIndex(
        (item) => item.transaction_id === action.payload
      );
      if (index > -1) {
        state.unconfirmed.splice(index, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        transactionSlice.endpoints.getUnconfirmedTransactions.matchFulfilled,
        (state, action) => {
          // Add the action payload (query response) to the state
          // the query will only ever return items that are definitely not confirmed yet,
          // but might already be in the store, so we need to dedupe
          let currentIds: { [key: string]: boolean } = {};
          state.unconfirmed.forEach(
            (item) => (currentIds[item.transaction_id] = true)
          );
          state.unconfirmed = [
            ...state.unconfirmed,
            ...action.payload.results.filter(
              (item) => !currentIds[item.transaction_id]
            )
          ];
        }
      )
      .addMatcher(
        transactionSlice.endpoints.confirmTransactions.matchFulfilled,
        (state, action) => {
          // When updates are sent to the server we can clear the confirmed queue
          state.confirmedQue.splice(0, state.confirmedQue.length);
        }
      );
  }
});

export const filteredFetchedConfirmedTransactions = createSlice({
  name: 'filteredFetchedonfirmedTransactions',
  initialState: {
    filtered: [],
    unfiltered: [],
    filter: {
      date_range: [
        // The app starts out with the current month and year being the focus.
        // If the user moves through different months, the filter will be updated or over written.
        dayjs().startOf('month').unix(),
        dayjs().endOf('month').unix()
      ]
    }
  } as TransactionsFilterState,
  reducers: {
    setConfirmedTransactionFilter: (state, action: PayloadAction<TransactionsFilter>) => {
      state.filter = action.payload;
    },
    clearConfirmedTransactionFilter: (state) => {
      state.filter = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        budgetItemMetaDataSlice.actions.setBudgetMonthYear,
        (state, action) => {
          state.filter = {
            ...state.filter,
            date_range: [
              dayjs(`${action.payload.year}-${action.payload.month}-01`).startOf('month').unix(),
              dayjs(`${action.payload.year}-${action.payload.month}-01`).endOf('month').unix()
            ]
          };
        }
      )
      .addMatcher(
        transactionSlice.endpoints.getTransactions.matchFulfilled,
        (state, action) => {
          if (
            action.meta.arg.originalArgs.confirmed &&
            !action.meta.arg.originalArgs.category
          ) {
            state.filtered = action.payload.results;
            state.unfiltered = action.payload.results;
          }
        }
      )
  }
});

// Confirm a single transaction and update the metadata
// for the bills and categories. The argument is an object
// with the transaction id and the confirmed categories/bills
export const confirmAndUpdateMetaData = createAsyncThunk(
  'confirmStack/confirmAndDispatch',
  async (
    transaction: Transaction,
    { dispatch }
  ) => {
    dispatch(
      confirmStack.actions.confirmTransaction(transaction.transaction_id)
    );

    if (transaction.categories && transaction.categories.length > 0) {
      for (const { id, fraction, period } of transaction.categories) {
        dispatch(
          addTransaction2Cat({
            categoryId: id,
            amount: transaction.amount * fraction,
            period
          })
        );
      }
    } else if (transaction.bill) {
      dispatch(
        addTransaction2Bill({
          billId: transaction.bill.id,
          amount: transaction.amount
        })
      );
    }
  }
);

// Actions and hooks
export const { removeUnconfirmedTransaction, updateTransaction } = confirmStack.actions;
export const { setConfirmedTransactionFilter, clearConfirmedTransactionFilter } = filteredFetchedConfirmedTransactions.actions;

export const {
  useTransactionsSyncMutation,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useLazyGetUnconfirmedTransactionsQuery,
  useConfirmTransactionsMutation,
  useUpdateTransactionMutation,
  useAddNoteMutation,
  useUpdateDeleteNoteMutation,
  useGetMerchantsQuery,
  useGetTransactionsCountQuery
} = transactionSlice;

export const useGetTransactionQueryState = transactionSlice.endpoints.getTransactions.useQueryState;

// Selectors
const selectUnconfirmed = (state: RootStateWithTransactions) => state.confirmStack.unconfirmed;
const selectConfirmedQue = (state: RootStateWithTransactions) => state.confirmStack.confirmedQue;
const selectDateYear = (state: RootStateWithTransactions, date: { year: number; month: number }) => date;
const selectMonthYear = (state: RootStateWithTransactions, date: { year: number; month: number }) => date;
export const selectFilteredFetchedConfirmedTransactions = (state: RootStateWithTransactions) => state.filteredFetchedonfirmedTransactions.filtered;
export const selectConfirmedTransactionFilter = (state: RootStateWithTransactions) => state.filteredFetchedonfirmedTransactions.filter;
export const selectConfirmedLength = (state: RootStateWithTransactions) => state.confirmStack.confirmedQue.length;

export const selectUnconfirmedTransactions = createSelector(
  [selectUnconfirmed, selectMonthYear],
  (unconfirmed, date) =>
    unconfirmed.filter((item) => {
      const itemDate = new Date(item.datetime || item.date);
      return (
        itemDate.getUTCFullYear() === date.year &&
        itemDate.getUTCMonth() + 1 === date.month
      );
    })
);

export const selectConfirmedTransactions = createSelector(
  [selectConfirmedQue, selectDateYear],
  (confirmedQue, date) =>
    confirmedQue.filter((item) => {
      const itemDate = new Date(
        item.transaction.datetime || item.transaction.date
      );
      return (
        itemDate.getUTCFullYear() === date.year &&
        itemDate.getUTCMonth() + 1 === date.month
      );
    })
);
