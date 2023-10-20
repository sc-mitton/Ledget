import { apiSlice } from '@api/apiSlice'

interface Alert {
    percent_amount: number
}

interface Category {
    period: 'year' | 'month',
    name: string,
    emoji: string,
    limit_amount: number,
    alerts: Alert[],
}

interface GetCategoriesParams {
    month: string,
    year: string,
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], GetCategoriesParams>({
            query: (params) => ({
                url: 'categories',
                params: params,
                method: 'GET',
            }),
        }),
        addNewCategory: builder.mutation<any, Category[] | Category>({
            query: (data) => ({
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
