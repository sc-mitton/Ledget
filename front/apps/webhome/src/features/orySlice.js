import { apiSlice } from '@api/apiSlice'
import axios from 'axios'

export const axiosBaseQuery = async ({ url, method, data, params, transformResponse }) => {
    const oryBaseUrl = import.meta.env.VITE_ORY_API_URI
    try {
        const result = await axios({
            url: oryBaseUrl + url,
            method: method,
            data: data,
            params: params,
            withCredentials: true,
            transformResponse: transformResponse
        })
        return { data: result.data }
    } catch (axiosError) {
        let err = axiosError
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        }
    }
}

const createFlow = async ({ url, params, transformResponse }) => {
    const result = await axiosBaseQuery({
        url: `${url}/browser`,
        method: 'GET',
        params: params,
        transformResponse: transformResponse
    })
    return result.data ? { data: result.data } : { error: result.error }
}

const getFlow = async ({ url, params, transformResponse }) => {
    let result
    const { id, ...rest } = params
    if (id) {
        result = await axiosBaseQuery({
            url: `${url}/flows`,
            method: 'GET',
            params: params,
            transformResponse: transformResponse
        })
    }
    if (!id || result.error?.status === 410) {
        result = await createFlow({
            url,
            transformResponse,
            params: { ...rest }
        })
    }
    return result.data ? { data: result.data } : { error: result.error }
}

const completeFlow = async ({ url, data, params }) => {
    const result = await axiosBaseQuery({
        url: `${url}`,
        method: 'POST',
        data: data,
        params: params,
    })
    return result.data ? { data: result.data } : { error: result.error }
}

const endpoints = [
    { name: 'settings', keepUnusedDataFor: 60 * 3 },
    { name: 'login', keepUnusedDataFor: 60 * 3 },
    { nam: 'logout' }
]

export const orySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettingsFlow: builder.query({
            queryFn: (arg) => getFlow({
                url: '/self-service/settings',
                params: { ...arg.params, id: arg.flowId },
                transformResponse: (data) => {
                    const json = JSON.parse(data)
                    return {
                        id: json.id,
                        csrf_token: json.ui?.nodes.find((node) =>
                            node.attributes.name === 'csrf_token')?.attributes.value,
                        nodes: json.ui?.nodes,
                        expires_at: json.expires_at,
                    }
                }
            }),
            cacheKey: 'getSettingsFlow',
            keepUnusedDataFor: 60 * 3,
        }),
        completeSettingsFlow: builder.mutation({
            queryFn: (arg) => completeFlow({
                url: '/self-service/settings',
                params: { ...arg.params, flow: arg.flowId },
                data: arg.data,
            }),
            cacheKey: 'completeSettingsFlow'
        }),
        getLoginFlow: builder.query({
            queryFn: (arg) => getFlow({
                url: '/self-service/login',
                params: { ...arg.params, id: arg.flowId },
            }),
            cacheKey: 'getLoginFlow',
            keepUnusedDataFor: 60 * 3,
        }),
        completeLoginFlow: builder.mutation({
            queryFn: (arg) => completeFlow({
                url: '/self-service/login',
                params: { ...arg.params, flow: arg.flowId },
                data: arg.data
            }),
            invalidatesTags: ['user'],
            cacheKey: 'completeLoginFlow'
        }),
        getLogoutFlow: builder.query({
            queryFn: (arg = {}) => getFlow({
                url: '/self-service/logout',
                params: { ...arg.params },
            }),
        }),
        completeLogoutFlow: builder.mutation({
            queryFn: (arg = {}) => completeFlow({
                url: '/self-service/logout',
                params: { ...arg.params },
                data: arg.data
            }),
            invalidatesTags: ['user']
        })
    }),
})

export const {
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    useGetLogoutFlowQuery,
    useCompleteLogoutFlowMutation,
} = orySlice
