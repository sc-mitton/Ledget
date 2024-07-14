import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';

import { tagTypes } from './types';
import { selectApiUrl, selectSessionToken } from '../environmentSlice/slice'
import type { RootStateWithEnvironment } from '../environmentSlice/slice'

const rawBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: '',
    credentials: 'include',
    prepareHeaders: async (headers, { getState }) => {
      const sessionToken = selectSessionToken(getState() as RootStateWithEnvironment);

      if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`);
      }

      // Set http_x_csrftoken header from the cookies
      const csrftoken = Cookies.get('csrftoken') || '';
      if (csrftoken) {
        headers.set('X-CsrfToken', csrftoken);
      }
      return headers;
    }
  }),
  { maxRetries: 5 }
);

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const apiUrl = selectApiUrl(api.getState() as RootStateWithEnvironment);

  // gracefully handle scenarios where data to generate the URL is missing
  if (!apiUrl) {
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'Environment not set in redux',
      },
    }
  }

  const urlEnd = typeof args === 'string' ? args : args.url
  // construct a dynamically generated portion of the url
  const adjustedUrl = `${apiUrl}${urlEnd}`
  const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl }

  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions)
}

const apiSlice = createApi({
  reducerPath: 'ledget',
  baseQuery: dynamicBaseQuery,
  tagTypes,
  endpoints: (builder) => ({})
});

export default apiSlice;
