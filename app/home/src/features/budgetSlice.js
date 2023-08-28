import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addNewCategory: builder.mutation({
            query: ({ data }) => ({
                url: 'category',
                method: 'POST',
                body: data,
            }),
        }),
        addnewBill: builder.mutation({
            query: ({ data }) => ({
                url: 'bill',
                method: 'POST',
                body: data,
            }),
        })
    }),
})

export const {
    useAddNewCategoryMutation,
    useAddnewBillMutation,
} = extendedApiSlice
