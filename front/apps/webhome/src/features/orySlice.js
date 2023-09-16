import { apiSlice } from '@api/apiSlice'
import axios from 'axios'

export const axiosBaseQuery = async ({ url, method, data, params }) => {
    const oryBaseUrl = import.meta.env.VITE_ORY_API_URI
    try {
        const result = await axios({
            url: oryBaseUrl + url,
            method: method,
            data: data,
            params: params,
            withCredentials: true
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

const createFlow = async ({ url, params }) => {
    const result = await axiosBaseQuery({
        url: `${url}/browser`,
        method: 'GET',
        params: params,
    })
    return result.data ? { data: result.data } : { error: result.error }
}

const getFlow = async ({ url, params }) => {
    let result
    const { id, ...rest } = params
    if (id) {
        result = await axiosBaseQuery({
            url: `${url}/flows`,
            method: 'GET',
            params: params,
        })
    }
    if (!id || result.error?.status === 410) {
        result = await createFlow({ url, params: { ...rest } })
    }
    return result.data ? { data: result.data } : { error: result.error }
}

const completeFlow = async ({ url, data, params }) => {
    let result
    const { flow } = params
    if (flow) {
        result = await axiosBaseQuery({
            url: `${url}`,
            method: 'POST',
            data: data,
            params: params,
        })
    }
    return result.data ? { data: result.data } : { error: result.error }
}


export const orySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettingsFlow: builder.query({
            queryFn: (arg) => getFlow({
                url: '/self-service/settings',
                params: { ...arg.params, id: arg.flowId },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),
        completeSettingsFlow: builder.mutation({
            queryFn: (arg) => completeFlow({
                url: '/self-service/settings',
                params: { ...arg.params, flow: arg.flowId },
                data: arg.data
            }),
        }),
        getLoginFlow: builder.query({
            queryFn: (arg) => getFlow({
                url: '/self-service/login',
                params: { ...arg.params, id: arg.flowId },
            }),
            keepUnusedDataFor: 60 * 10, // 10 minutes
        }),
        completeLoginFlow: builder.mutation({
            queryFn: (arg) => completeFlow({
                url: '/self-service/login',
                params: { ...arg.params, flow: arg.flowId },
                data: arg.data
            }),
            invalidatesTags: ['user'],
        }),
    }),
})

export const {
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation
} = orySlice
