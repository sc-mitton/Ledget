import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const apiSlice = (baseUrl: string) =>
  createApi({
    reducerPath: 'ledget',
    baseQuery: retry(
      fetchBaseQuery({
        baseUrl: baseUrl,
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
    ),

    tagTypes: [
      'Transaction',
      'Bill',
      'Category',
      'UnconfirmedTransaction',
      'Account',
      'SpendingHistory',
      'Device',
      'User',
      'TransactionCount'
    ],
    endpoints: (builder) => ({})
  });
