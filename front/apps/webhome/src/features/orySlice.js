import { apiSlice } from '@api/apiSlice'
import { generateEndpoints } from 'ory-sdk'

export const orySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => generateEndpoints(builder),
})

export const {
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    useGetLogoutFlowQuery,
    useCompleteLogoutFlowMutation,
    useLazyGetUpdatedLogoutFlowQuery,
    useLazyGetVerificationFlowQuery,
    useCompleteVerificationFlowMutation,
} = orySlice
