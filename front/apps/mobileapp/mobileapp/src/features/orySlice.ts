import { Platform } from 'react-native'
import { apiSlice } from '@ledget/shared-features';
import { generateEndpoints } from '@ledget/ory';

export const orySlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    generateEndpoints(builder, 'mobile', Platform.OS === 'ios'
      ? process.env.IOS_ORY_API_URI || ''
      : process.env.ANDROID_ORY_API_URI || ''),
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
  useLazyGetRecoveryFlowQuery,
  useCompleteRecoveryFlowMutation,
} = orySlice;
