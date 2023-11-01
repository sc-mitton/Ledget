import { apiSlice } from '@api/apiSlice'

const apiWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: ['PlaidItem', 'PlaidToken'],
})

interface Institution {
    id: string
    name: string
    logo?: string
    primary_color?: string
    url?: string
    oath?: string
}

interface Account {
    id: string
    name: string
    mask: string
    subtype?: string
    type: string
    verification_status?: string
}

interface PlaidItem {
    user: string
    id: string
    access_token?: string
    cursor?: string
    login_required: boolean
    new_accounts_available: boolean
    permission_revoked: boolean
    institution: Institution
    accounts: Account[]
}

export const extendedApiSlice = apiWithTags.injectEndpoints({
    endpoints: (builder) => ({
        getPlaidToken: builder.query<string, { isOnboarding: boolean, itemId: string }>({
            query: ({ isOnboarding, itemId }) => ({
                url: `plaid_link_token${isOnboarding ? '?is_onboarding=true' : ''}${itemId ? `/${itemId}` : ''}`,
            }),
            providesTags: ['PlaidToken'],
        }),
        getPlaidItems: builder.query<PlaidItem[], void>({
            query: () => 'plaid_items',
            providesTags: ['PlaidItem'],
        }),
        deletePlaidItem: builder.mutation<void, { itemId: string }>({
            query: ({ itemId }) => ({
                url: `/plaid_item/${itemId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['PlaidItem'],
        }),
        addNewPlaidItem: builder.mutation<any, { data: PlaidItem }>({
            query: ({ data }) => ({
                url: 'plaid_token_exchange',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['PlaidItem'],
            extraOptions: { maxRetries: 5 }
        }),
        updatePlaidItem: builder.mutation<any, { itemId: string, data: PlaidItem }>({
            query: ({ itemId, data }) => ({
                url: `/plaid_item/${itemId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['PlaidItem'],
            extraOptions: { maxRetries: 5 }
        }),
    })
})

export const {
    useGetPlaidTokenQuery,
    useLazyGetPlaidTokenQuery,
    useGetPlaidItemsQuery,
    useAddNewPlaidItemMutation,
    useDeletePlaidItemMutation,
    useUpdatePlaidItemMutation,
} = extendedApiSlice
