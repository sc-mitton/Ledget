import apiSlice from '../apiSlice/slice';
import { Reminder } from './types';

export const remindersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<Reminder[], void>({
      query: () => 'reminders',
      providesTags: ['Reminder'],
    }),
    addReminder: builder.mutation<
      Reminder,
      Partial<Reminder> & { bill: string }
    >({
      query: (payload) => ({
        url: 'reminders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Reminder'],
    }),
  }),
});

export const { useGetRemindersQuery, useAddReminderMutation } =
  remindersApiSlice;
