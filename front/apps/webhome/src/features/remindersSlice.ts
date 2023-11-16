import { apiSlice } from '@api/apiSlice'

export interface Reminder {
    id: string
    offset: number
    period: 'day' | 'week'
    active: boolean
}


const remindersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReminders: builder.query<Reminder[], void>({
            query: () => 'reminders',
        }),
    }),
})

export const { useGetRemindersQuery } = remindersApiSlice
