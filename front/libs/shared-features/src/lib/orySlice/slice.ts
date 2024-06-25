import apiSlice from '../apiSlice/slice';
import { generateEndpoints } from '@ledget/ory';

const getPlatform = () => {
  // Check if web or mobile, else return web
  if (typeof window !== 'undefined') {
    return 'browser';
  } else {
    return 'mobile';
  }
}

export const orySlice = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    generateEndpoints(builder, getPlatform())
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
