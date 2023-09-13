import { apiSlice } from '@api/apiSlice'
import axios from 'axios'

export const axiosBaseQuery = async ({ url, method, data, params }) => {
    try {
        const result = await axios({ url, method, data, params, withCredentials: true })
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


export const orySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettingsFlow: builder.query({
            async queryFn(arg) {
                const oryBaseUrl = import.meta.env.VITE_ORY_API_URI
                let result
                if (arg.flowId) {
                    result = await axiosBaseQuery({
                        url: `${oryBaseUrl}/self-service/settings/flows/?id=${arg.flowId}`,
                        method: 'GET',
                    })
                } else {
                    result = await axiosBaseQuery({
                        url: `${oryBaseUrl}/self-service/settings/browser`,
                        method: 'GET',
                    })
                }
                return result.data ? { data: result.data } : { error: result.error }
            }
        })
    }),
})

export const {
    useLazyGetSettingsFlowQuery,
} = orySlice
