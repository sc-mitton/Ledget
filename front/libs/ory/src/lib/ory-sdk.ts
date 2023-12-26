import axios, { AxiosError, AxiosResponse } from 'axios'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

interface AxiosBaseQueryParams {
  url: string;
  method: string;
  data?: any;
  params?: any;
  transformResponse?: any;
}

interface AxiosBaseQueryResult<T> {
  data?: T;
  error?: {
    status?: number;
    data?: any;
  }
}

export const axiosBaseQuery = async <T>({ url, method, data, params, transformResponse }: AxiosBaseQueryParams): Promise<AxiosBaseQueryResult<T>> => {
  const oryBaseUrl = import.meta.env.VITE_ORY_API_URI;

  try {
    const result: AxiosResponse<T> = await axios({
      url: oryBaseUrl + url,
      withCredentials: true,
      method,
      data,
      params,
      transformResponse,
    })

    return { data: result.data }
  } catch (axiosError) {
    let err = axiosError as AxiosError
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    }
  }
}

const createFlow = async ({ url, params, transformResponse }: Omit<AxiosBaseQueryParams, 'method'>) => {
  const result = await axiosBaseQuery({
    url: `${url}/browser`,
    method: 'GET',
    params: params,
    transformResponse: transformResponse,
    data: null
  })
  return result.data ? { data: result.data } : { error: result.error }
}

const getFlow = async ({ url, params = {}, transformResponse }: Omit<AxiosBaseQueryParams, 'method'>) => {
  let result
  const { id, ...rest } = params
  if (id) {
    result = await axiosBaseQuery({
      url: `${url}/flows`,
      method: 'GET',
      params: params,
      transformResponse: transformResponse,
      data: null
    })
  }
  if (!id || result?.error?.status === 410) {
    result = await createFlow({
      url,
      transformResponse,
      params: { ...rest }
    })
  }
  return result?.data ? { data: result.data } : { error: result?.error }
}

const completeFlow = async ({ url, data, params }: Omit<AxiosBaseQueryParams, 'method'>) => {
  const result = await axiosBaseQuery({
    url: `${url}`,
    method: 'POST',
    data: data,
    params: params,
    transformResponse: () => { },
  })
  return result.data ? { data: result.data } : { error: result.error }
}

export const endpointNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
] as const



const generateOryEndpoints = (builder: EndpointBuilder<any, any, any>) => {

  let endpoints: any = {}
  endpointNames.forEach((endpoint) => {

    const baseName = `${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`

    endpoints[`get${baseName}Flow`] = builder.query({
      queryFn: (arg: any) => getFlow({
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
        }
      })
    })

    if (endpoint === 'logout') return

    endpoints[`complete${baseName}Flow`] = builder.mutation({
      queryFn: (arg: any) => completeFlow({
        url: `/self-service/${endpoint}`,
        params: arg?.params,
        data: arg?.data,
      }),
    })
  })

  endpoints['getUpdatedLogoutFlow'] = builder.query({
    queryFn: (arg: any) => axiosBaseQuery({
      url: '/self-service/logout',
      method: 'GET',
      params: { token: arg.token },
    }) as Promise<any>
  })

  return endpoints
}

export const generateEndpoints = generateOryEndpoints
