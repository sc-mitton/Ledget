import { apiSlice } from '@api/apiSlice'
import { generateEndpoints } from '@ledget/ory'

export const orySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => generateEndpoints(builder),
})

console.log('orySlice', orySlice)

export const {
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    useLazyGetLoginFlowQuery,
    useCompleteLoginFlowMutation,
    useGetLogoutFlowQuery,
    useLazyGetLogoutFlowQuery,
    useCompleteLogoutFlowMutation,
    useLazyGetUpdatedLogoutFlowQuery,
    useLazyGetVerificationFlowQuery,
    useCompleteVerificationFlowMutation,
} = orySlice
