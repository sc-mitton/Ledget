import { apiSlice } from '@api/apiSlice'
import { generateEndpoints } from '@ledget/ory'

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
