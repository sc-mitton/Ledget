import { apiSlice } from '@api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: 'categories',
                method: 'GET',
            }),
        }),
        addNewCategory: builder.mutation({
            query: ({ data }) => ({
                url: 'category',
                method: 'POST',
                body: data,
            }),
        })
    }),
})

export const {
    useAddNewCategoryMutation,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
} = extendedApiSlice
