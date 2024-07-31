import { Platform } from 'react-native'
import { apiSlice } from '@ledget/shared-features';
import { generateEndpoints } from '@ledget/ory';
import { IOS_ORY_API_URI, ANDROID_ORY_API_URI } from '@env';

export const orySlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    generateEndpoints(builder, 'mobile', Platform.OS === 'ios'
      ? IOS_ORY_API_URI || ''
      : ANDROID_ORY_API_URI || ''),
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
