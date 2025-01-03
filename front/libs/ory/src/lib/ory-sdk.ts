import axios, { AxiosError } from 'axios';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import {
  AxiosBaseQueryConfig,
  endpointRootNames,
  GetEndpointName,
  OryEndpointDefenitions,
  OryNativeEndpointDefenitions,
  CompleteEndpointName,
  Platform,
  OryAxiosQueryConfig,
} from './types';
import { selectSessionToken, selectDeviceToken } from '@ledget/shared-features';

const axiosBaseQuery = async ({
  url,
  headers,
  ...rest
}: AxiosBaseQueryConfig) => {
  try {
    const result = await axios({
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      ...rest,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

const createFlow = async (args: OryAxiosQueryConfig) => {
  const data = await axiosBaseQuery({
    method: 'GET',
    ...args,
  });
  return data.error ? { error: data.error } : { data: data.data };
};

const getFlow = async ({
  url,
  params = {},
  transformResponse,
  platform,
  headers,
}: OryAxiosQueryConfig & { platform: Platform }) => {
  const { id, ...rest } = params;
  if (id) {
    const data = await axiosBaseQuery({
      url: `${url}/flows`,
      method: 'GET',
      params,
      headers,
      transformResponse,
    });
    if (data.error?.status === 410) {
      return createFlow({
        url: `${url}/${platform === 'browser' ? 'browser' : 'api'}`,
        transformResponse,
        headers,
        params: { ...rest },
      });
    } else {
      return data.error ? { error: data.error } : { data: data.data };
    }
  } else {
    return createFlow({
      url: `${url}/${platform === 'browser' ? 'browser' : 'api'}`,
      transformResponse,
      headers,
      params: { ...rest },
    });
  }
};

const completeFlow = async (args: OryAxiosQueryConfig) => {
  const responseData = await axiosBaseQuery({
    method: 'POST',
    ...args,
  });
  return responseData.error
    ? { error: responseData.error }
    : { data: responseData.data };
};

const generateOryEndpoints = (
  builder: EndpointBuilder<any, any, any>,
  platform: Platform,
  baseUrl: string
) => {
  const endpoints =
    platform === 'mobile'
      ? ({} as OryNativeEndpointDefenitions)
      : ({} as OryEndpointDefenitions);

  endpointRootNames.forEach((endpoint) => {
    const baseEndpointName = `${endpoint
      .charAt(0)
      .toUpperCase()}${endpoint.slice(1)}`;
    const getEndpointName = `get${baseEndpointName}Flow` as GetEndpointName<
      typeof endpoint
    >;
    const completeEndpointNameName =
      `complete${baseEndpointName}Flow` as CompleteEndpointName<
        typeof endpoint
      >;

    endpoints[getEndpointName] = builder.query<any, any>({
      queryFn: (arg, api) => {
        const sessionToken = selectSessionToken(api.getState() as any);
        const deviceToken = selectDeviceToken(api.getState() as any);

        const headers: any = {};
        if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`;
        if (deviceToken) headers['X-Device-Token'] = deviceToken;

        return getFlow({
          url: `${baseUrl}/self-service/${endpoint}`,
          params: arg?.params,
          headers,
          transformResponse: (data: any) => {
            const json = JSON.parse(data);
            let filteredData: any = {};
            const csrf_token = json.ui?.nodes.find(
              (node: any) => node.attributes.name === 'csrf_token'
            )?.attributes.value;
            const keys = ['logout_token', 'ui', 'id', 'expires_at'];

            keys.forEach((key) => {
              if (json[key]) filteredData[key] = json[key];
            });

            if (csrf_token) filteredData['csrf_token'] = csrf_token;

            return json.error ? json.error : filteredData;
          },
          platform,
        });
      },
    });

    if (endpoint === 'logout') {
      endpoints['getUpdatedLogoutFlow'] = builder.query<any, any>({
        queryFn: (arg, api) => {
          const sessionToken = selectSessionToken(api.getState() as any);
          const deviceToken = selectDeviceToken(api.getState() as any);

          const headers: any = {};
          if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`;
          if (deviceToken) headers['X-Device-Token'] = deviceToken;

          return axiosBaseQuery({
            url: `${baseUrl}/self-service/logout`,
            method: 'GET',
            headers,
            params: { token: arg.token },
          });
        },
      });
      return;
    }

    endpoints[completeEndpointNameName] = builder.mutation<any, any>({
      queryFn: (arg, api) => {
        const sessionToken = selectSessionToken(api.getState() as any);
        const deviceToken = selectDeviceToken(api.getState() as any);

        const headers: any = {};
        if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`;
        if (deviceToken) headers['X-Device-Token'] = deviceToken;

        return completeFlow({
          url: `${baseUrl}/self-service/${endpoint}`,
          headers,
          params: arg?.params,
          data: arg?.data,
          withCredentials: platform === 'browser',
        });
      },
    });
  });

  return endpoints;
};

export const generateEndpoints = generateOryEndpoints;
