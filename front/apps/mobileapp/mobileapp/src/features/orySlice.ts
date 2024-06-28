import { apiSlice } from '@ledget/shared-features';
import { generateEndpoints } from '@ledget/ory';
import { ORY_API_URI } from '@env';

export const orySlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    generateEndpoints(builder, 'mobile', ORY_API_URI)
});

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
  useCompleteVerificationFlowMutation
} = orySlice;
