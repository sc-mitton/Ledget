import apiSlice from '../apiSlice/slice';
import {
  Bill,
  NewBill,
  UpdateBill,
  TransformedBill,
  BillQueryParams,
} from './types';

export const billSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBills: builder.query<TransformedBill[], BillQueryParams | void>({
      query: (params) => {
        const queryObj = {
          url: 'bills',
          method: 'GET',
        };
        if (params) {
          return { ...queryObj, params };
        }
        return queryObj;
      },
      keepUnusedDataFor: 15 * 60,
      providesTags: ['Bill'],
      transformResponse: (response: Bill[]) => {
        const today = new Date();
        const bills: TransformedBill[] = [];

        // Set date for each bill
        response.forEach((bill) => {
          const { day, week, week_day, month, year } = bill;

          if (bill.period === 'month' && bill.week && bill.week_day) {
            // monthly bills with week and week_day
            let date = new Date(today.getFullYear(), today.getMonth());
            date.setDate(1 + (week! - 1) * 7);
            // subtract one because backend models indexes at 1
            date.setDate(
              date.getDate() + ((week_day! - 1 - date.getDay() + 7) % 7)
            );

            bills.push({
              ...bill,
              date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                day || 1
              ).toISOString(),
            });
          } else if (bill.period === 'month' && bill.day) {
            // monthly bills with day
            bills.push({
              ...bill,
              date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                day || 1
              ).toISOString(),
            });
          } else if (
            bill.period === 'once' &&
            bill.month &&
            bill.day &&
            bill.year
          ) {
            // once bills
            bills.push({
              ...bill,
              date: new Date(year!, month! - 1, day!).toISOString(),
            });
          } else if (bill.period === 'year' && bill.month && bill.day) {
            // yearly bills
            bills.push({
              ...bill,
              date: new Date(
                today.getFullYear(),
                month! - 1,
                day!
              ).toISOString(),
            });
          }
        });
        return bills.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      },
    }),
    getBillRecommendations: builder.query<any, any>({
      query: () => ({
        url: 'bills/recommendations',
        method: 'GET',
      }),
    }),
    addnewBill: builder.mutation<any, NewBill | NewBill[]>({
      query: (data) => ({
        url: 'bills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bill'],
    }),
    updateBills: builder.mutation<any, UpdateBill>({
      query: (data) => ({
        url: `bills/${data.id}`,
        method: Array.isArray(data)
          ? 'PATCH'
          : data.upper_amount || data.lower_amount
          ? 'PUT'
          : 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Bill'],
    }),
    deleteBill: builder.mutation<
      any,
      { billId: string; data: { instances: 'all' | 'single' | 'complement' } }
    >({
      query: (data) => ({
        url: `bills/${data.billId}`,
        params: data.data,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bill'],
    }),
  }),
});

export function isBill(obj: any | undefined): obj is Bill {
  return obj ? 'reminders' in obj : false;
}

export const {
  useAddnewBillMutation,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useGetBillRecommendationsQuery,
  useUpdateBillsMutation,
  useDeleteBillMutation,
} = billSlice;
