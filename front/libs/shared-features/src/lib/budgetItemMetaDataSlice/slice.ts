import { createSelector, createSlice } from '@reduxjs/toolkit';
import Big from 'big.js';

import { PayloadAction } from '@reduxjs/toolkit';

import { billSlice } from '../billSlice/slice';
import { categorySlice } from '../categorySlice/slice';
import { InitialState, RootStateWithMetaData } from './types';

const initialState: InitialState = {
  budgetMonth: new Date().getMonth() + 1,
  budgetYear: new Date().getFullYear(),

  // Categories
  unsyncedConfirmedSpending: {},
  categoryMetaData: {},

  // Bills
  billIdPeriodMap: {},
  unsyncedConfirmedBills: [],
  billsMetaData: {}
};

const emptyBillMetaData = {
  monthly_bills_paid: 0,
  yearly_bills_paid: 0,
  number_of_monthly_bills: 0,
  number_of_yearly_bills: 0,
  monthly_bills_amount_remaining: 0,
  yearly_bills_amount_remaining: 0,
  total_monthly_bills_amount: 0,
  total_yearly_bills_amount: 0
};
const emptyCategoryMetaData = {
  monthly_spent: 0,
  yearly_spent: 0,
  limit_amount_monthly: 0,
  limit_amount_yearly: 0,
  oldest_yearly_category_created: ''
};

export const budgetItemMetaDataSlice = createSlice({
  name: 'budgetItemMetaData',
  initialState,
  reducers: {
    setBudgetMonthYear: (
      state,
      action: PayloadAction<{ month: number; year: number }>
    ) => {
      state.budgetMonth = action.payload.month;
      state.budgetYear = action.payload.year;
    },

    // Categories
    addTransaction2Cat: (
      state,
      action: PayloadAction<{
        categoryId: string;
        amount: number;
        period: 'month' | 'year';
      }>
    ) => {
      if (action.payload.period === 'month') {
        state.categoryMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].monthly_spent += action.payload.amount;
      } else {
        state.categoryMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].yearly_spent += action.payload.amount;
      }

      state.unsyncedConfirmedSpending[action.payload.categoryId] = {
        categoryPeriod: action.payload.period,
        amount: action.payload.amount
      };
    },

    // Bills
    addTransaction2Bill: (
      state,
      action: PayloadAction<{ billId: string; amount: number }>
    ) => {
      if (state.billIdPeriodMap[action.payload.billId] === 'month') {
        state.billsMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].monthly_bills_paid += action.payload.amount;
        state.billsMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].monthly_bills_amount_remaining -= action.payload.amount;
      } else if (state.billIdPeriodMap[action.payload.billId] === 'year') {
        state.billsMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].yearly_bills_paid += action.payload.amount;
        state.billsMetaData[
          `${state.budgetMonth}-${state.budgetYear}`
        ].yearly_bills_amount_remaining -= action.payload.amount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        categorySlice.endpoints.getCategories.matchFulfilled,
        (state, action) => {
          // If the query was just fetching the categories, and not getting
          // the amount spent, then skip updating the state
          const originalArgs = action.meta.arg.originalArgs;
          if (
            (!originalArgs?.month && !originalArgs?.year) ||
            originalArgs?.spending === false
          ) {
            return;
          }

          let monthlySpent = Big(0);
          let yearlySpent = Big(0);
          let limitAmountMonthly = 0;
          let limitAmountYearly = 0;
          let oldestYearlyCategoryCreated = '';

          action.payload.forEach((category) => {
            if (category.period === 'month') {
              if (category.amount_spent) {
                monthlySpent = monthlySpent.plus(
                  Big(category.amount_spent).times(100)
                );
              }
              limitAmountMonthly += category.limit_amount;
            } else if (category.period === 'year') {
              if (category.amount_spent) {
                yearlySpent = yearlySpent.plus(
                  Big(category.amount_spent).times(100)
                );
              }
              limitAmountYearly += category.limit_amount;
              if (
                oldestYearlyCategoryCreated === '' ||
                new Date(oldestYearlyCategoryCreated) >
                  new Date(category.created)
              ) {
                oldestYearlyCategoryCreated = category.created;
              }
            }
          });

          state.categoryMetaData[
            `${originalArgs?.month}-${originalArgs?.year}`
          ] = {
            monthly_spent: monthlySpent.toNumber(),
            yearly_spent: yearlySpent.toNumber(),
            limit_amount_monthly: limitAmountMonthly,
            limit_amount_yearly: limitAmountYearly,
            oldest_yearly_category_created: oldestYearlyCategoryCreated
          };

          // Clear unsynced spending
          state.unsyncedConfirmedSpending = {};
        }
      )
      .addMatcher(
        billSlice.endpoints.getBills.matchFulfilled,
        (state, action) => {
          // If the query was just fetching the categories, and not getting
          // the amount spent, then skip updating the state
          const originalArgs = action.meta.arg.originalArgs;
          if (!originalArgs?.month && !originalArgs?.year) {
            return;
          }

          let paidMonthlyBills = 0;
          let paidYearlyBills = 0;
          let numberOfMonthlyBills = 0;
          let numberOfYearlyBills = 0;
          let monthlyBillsAmountRemaining = Big(0);
          let yearlyBillsAmountRemaining = Big(0);
          let totalMonthlyBillsAmount = Big(0);
          let totalYearlyBillsAmount = Big(0);

          action.payload.forEach((bill) => {
            state.billIdPeriodMap[bill.id] = bill.period;

            if (bill.is_paid) {
              if (bill.period === 'month') {
                paidMonthlyBills++;
              } else if (bill.period === 'year') {
                paidYearlyBills++;
              }
            } else {
              if (bill.period === 'month') {
                monthlyBillsAmountRemaining = monthlyBillsAmountRemaining.plus(
                  bill.upper_amount
                );
              } else if (bill.period === 'year') {
                yearlyBillsAmountRemaining = yearlyBillsAmountRemaining.plus(
                  bill.upper_amount
                );
              }
            }
            bill.period === 'month'
              ? numberOfMonthlyBills++
              : numberOfYearlyBills++;
            bill.period === 'month'
              ? (totalMonthlyBillsAmount = totalMonthlyBillsAmount.plus(
                  bill.upper_amount
                ))
              : (totalYearlyBillsAmount = totalYearlyBillsAmount.plus(
                  bill.upper_amount
                ));
          });

          state.billsMetaData[`${originalArgs?.month}-${originalArgs?.year}`] =
            {
              monthly_bills_paid: paidMonthlyBills,
              yearly_bills_paid: paidYearlyBills,
              number_of_monthly_bills: numberOfMonthlyBills,
              number_of_yearly_bills: numberOfYearlyBills,
              monthly_bills_amount_remaining:
                monthlyBillsAmountRemaining.toNumber(),
              yearly_bills_amount_remaining:
                yearlyBillsAmountRemaining.toNumber(),
              total_monthly_bills_amount: totalMonthlyBillsAmount.toNumber(),
              total_yearly_bills_amount: totalYearlyBillsAmount.toNumber()
            };

          // Clear unsynced
          state.unsyncedConfirmedBills = [];
        }
      );
  }
});

export const { addTransaction2Cat, addTransaction2Bill, setBudgetMonthYear } =
  budgetItemMetaDataSlice.actions;

// Selectors

const selectMonth = (state: RootStateWithMetaData) =>
  state.budgetItemMetaData.budgetMonth;
const selectYear = (state: RootStateWithMetaData) =>
  state.budgetItemMetaData.budgetYear;
const selectBillMeta = (state: RootStateWithMetaData) =>
  Object.keys(state.budgetItemMetaData.billsMetaData).length
    ? state.budgetItemMetaData.billsMetaData
    : undefined;
const selectCategoryMeta = (state: RootStateWithMetaData) =>
  Object.keys(state.budgetItemMetaData.categoryMetaData).length
    ? state.budgetItemMetaData.categoryMetaData
    : undefined;

export const selectUnsyncedConfirmedSpending = (state: RootStateWithMetaData) =>
  state.budgetItemMetaData.unsyncedConfirmedSpending;
export const selectUnsyncedConfirmedBills = (state: RootStateWithMetaData) =>
  state.budgetItemMetaData.unsyncedConfirmedBills;

export const selectCategoryMetaData = createSelector(
  [selectMonth, selectYear, selectCategoryMeta],
  (month, year, categoryMetaData) => {
    const key = `${month}-${year}` as any;
    if (categoryMetaData && categoryMetaData[key]) {
      return categoryMetaData[key];
    } else {
      return emptyCategoryMetaData;
    }
  }
);
export const selectBillMetaData = createSelector(
  [selectMonth, selectYear, selectBillMeta],
  (month, year, billMetaData) => {
    const key = `${month}-${year}` as any;
    if (billMetaData && billMetaData[key]) {
      return billMetaData[key];
    } else {
      return emptyBillMetaData;
    }
  }
);

export const selectBudgetMonthYear = createSelector(
  [selectMonth, selectYear],
  (month, year) => ({ month, year })
);
