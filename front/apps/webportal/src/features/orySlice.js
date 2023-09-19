import { apiSlice } from '@api/apiSlice'
import { generateEndpoints } from '@ledget/ory-sdk'

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
    useLazyGetRegistrationFlowQuery,
    useCompleteRegistrationFlowMutation,
} = orySlice
