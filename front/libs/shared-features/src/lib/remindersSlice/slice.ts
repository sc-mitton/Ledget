import apiSlice from '../apiSlice/slice';
import { Reminder } from './types';

export const remindersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<Reminder[], void>({
      query: () => 'reminders'
    })
  })
});

export const { useGetRemindersQuery } = remindersApiSlice;
