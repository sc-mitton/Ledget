import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { tagTypes } from './types';

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: import.meta.env['VITE_LEDGET_API_URI'],
    credentials: 'include',
    prepareHeaders: async (headers, { getState }) => {
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

const apiSlice = createApi({
  reducerPath: 'ledget',
  baseQuery: baseQuery,
  tagTypes,
  endpoints: (builder) => ({})
});

export default apiSlice;
