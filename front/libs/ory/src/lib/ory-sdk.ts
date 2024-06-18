import axios, { AxiosError } from 'axios'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import {
  AxiosBaseQueryConfig,
  endpointRootNames,
  GetEndpointName,
  OryEndpointDefenitions,
  CompleteEndpointName,
  Platform,
  OryAxiosQueryConfig
} from './types'

const axiosBaseQuery = async ({ url, headers, ...rest }: AxiosBaseQueryConfig) => {
  const oryBaseUrl = import.meta.env.VITE_ORY_API_URI;

  try {
    const result = await axios({
      url: `${oryBaseUrl}${url}`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      ...rest
    })
    return { data: result.data }
  } catch (axiosError) {
    const err = axiosError as AxiosError
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    }
  }
}

const createFlow = async ({ url, params, transformResponse, platform }: OryAxiosQueryConfig) => {
  const data = await axiosBaseQuery({
    url: `${url}/${platform === 'browser' ? 'browser' : 'api'}`,
    method: 'GET',
    params: params,
    transformResponse: transformResponse,
  })
  return data.error ? { error: data.error } : { data: data.data }
}

const getFlow = async ({ url, params = {}, transformResponse, platform }: OryAxiosQueryConfig) => {
  const { id, ...rest } = params
  if (id) {
    const data = await axiosBaseQuery({
      url: `${url}/flows`,
      method: 'GET',
      params: params,
      transformResponse: transformResponse,
    })
    if (data.error?.status === 410) {
      return createFlow({
        url,
        transformResponse,
        params: { ...rest },
        platform
      })
    } else {
      return data.error ? { error: data.error } : { data: data.data }
    }
  } else {
    return createFlow({
      url,
      transformResponse,
      params: { ...rest },
      platform
    })
  }
}

const completeFlow = async ({ url, data, params }: Omit<OryAxiosQueryConfig, 'platform'>) => {
  const responseData = await axiosBaseQuery({
    url: `${url}`,
    method: 'POST',
    data: data,
    params: params
  })
  return responseData.error ? { error: responseData.error } : { data: responseData.data }
}

const generateOryEndpoints = (builder: EndpointBuilder<any, any, any>, platform: Platform) => {
  const endpoints = {} as OryEndpointDefenitions

  endpointRootNames.forEach((endpoint) => {

    const baseEndpointName = `${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`
    const getEndpointName = `get${baseEndpointName}Flow` as GetEndpointName<typeof endpoint>
    const completeEndpointNameName = `complete${baseEndpointName}Flow` as CompleteEndpointName<typeof endpoint>

    endpoints[getEndpointName] = builder.query<any, any>({
      queryFn: (arg) => getFlow({
        url: `/self-service/${endpoint}`,
        params: arg?.params,
        transformResponse: (data: any) => {
          const json = JSON.parse(data)
          let filteredData: any = {}

          const csrf_token = json.ui?.nodes.find((node: any) => node.attributes.name === 'csrf_token')?.attributes.value
          const keys = ['logout_token', 'ui', 'id', 'expires_at']

          keys.forEach((key) => {
            if (json[key]) filteredData[key] = json[key]
          })

          if (csrf_token) filteredData['csrf_token'] = csrf_token

          return json.error ? json.error : filteredData
        },
        platform
      })
    })

    if (endpoint === 'logout') {
      endpoints['getUpdatedLogoutFlow'] = builder.query<any, any>({
        queryFn: (arg: any) => axiosBaseQuery({
          url: '/self-service/logout',
          method: 'GET',
          params: { token: arg.token },
        })
      })
      return
    }

    endpoints[completeEndpointNameName] = builder.mutation<any, any>({
      queryFn: (arg) => completeFlow({
        url: `/self-service/${endpoint}`,
        params: arg?.params,
        data: arg?.data,
      }),
    })
  }
  )

  return endpoints
}

export const generateEndpoints = generateOryEndpoints
