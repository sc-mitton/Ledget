import { apiSlice } from '@ledget/shared-features';
import { generateEndpoints } from '@ledget/ory';

export const orySlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    generateEndpoints(builder, 'browser', import.meta.env.VITE_ORY_API_URI),
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
  useCompleteVerificationFlowMutation,
} = orySlice;
