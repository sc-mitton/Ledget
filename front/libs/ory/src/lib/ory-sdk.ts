import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { EndpointBuilder, MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { LoginFlow, SettingsFlow, RegistrationFlow, LogoutFlow, VerificationFlow, RecoveryFlow } from '@ory/client'


const endpointRootNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
] as const

export type EndpointRootNames = typeof endpointRootNames[number]

type TransformedSettingsFlow = SettingsFlow & { csrf_token: string }
type TransformedLoginFlow = LoginFlow & { csrf_token: string }
type TransformedRegistrationFlow = RegistrationFlow & { csrf_token: string }
type TransformedLogoutFlow = LogoutFlow & { csrf_token: string }
type TransformedVerificationFlow = VerificationFlow & { csrf_token: string }
type TransformedRecoveryFlow = RecoveryFlow & { csrf_token: string }

type OryQueryError = {
  status: number,
  data: any
}

type TOryEndpoint<TName extends EndpointRootNames, TType extends 'get' | 'complete'> =
  TName extends 'settings' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedSettingsFlow, any> : MutationDefinition<any, any, any, SettingsFlow, any> :
  TName extends 'login' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedLoginFlow, any> : MutationDefinition<any, any, any, LoginFlow, any> :
  TName extends 'registration' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedRegistrationFlow, any> : MutationDefinition<any, any, any, RegistrationFlow, any> :
  TName extends 'logout' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedLogoutFlow, any> : MutationDefinition<any, any, any, LogoutFlow, any> :
  TName extends 'verification' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedVerificationFlow, any> : MutationDefinition<any, any, any, VerificationFlow, any> :
  TName extends 'recovery' ? TType extends 'get' ? QueryDefinition<any, any, any, TransformedRecoveryFlow, any> : MutationDefinition<any, any, any, RecoveryFlow, any> :
  never

export type OryGetFlowEndpoint<TName extends EndpointRootNames> = TOryEndpoint<TName, 'get'>

export type OryCompleteFlowEndpoint<TName extends EndpointRootNames> = TOryEndpoint<TName, 'complete'>

type GetEndpointName<TName extends EndpointRootNames> = `get${Capitalize<TName>}Flow`
type CompleteEndpointName<TName extends EndpointRootNames> = `complete${Capitalize<TName>}Flow`

type OryEndpointDefenitions = {
  [K in EndpointRootNames as GetEndpointName<K>]: OryGetFlowEndpoint<K>
} & {
    [K in EndpointRootNames as CompleteEndpointName<K>]: OryCompleteFlowEndpoint<K>
  } & {
    getUpdatedLogoutFlow: OryGetFlowEndpoint<'logout'>
  }

type AxiosBaseQueryConfig = {
  url: string
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  transformResponse?: AxiosRequestConfig['transformResponse']
}

export const axiosBaseQuery = (config: AxiosBaseQueryConfig) => {
  const oryBaseUrl = import.meta.env.VITE_ORY_API_URI;
  const { url, ...rest } = config
  return axios({
    url: oryBaseUrl + url,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...rest,
  }).then((response: AxiosResponse) => ({ data: response.data }))
    .catch((error: AxiosError) => {
      throw {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message
        },
      }
    })
}

const axiosBaseQ = async ({ url, headers, ...rest }: AxiosBaseQueryConfig) => {
  try {
    const result = await axios({
      url: url,
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

const createFlow = async ({ url, params, transformResponse }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) =>
  axiosBaseQuery({
    url: `${url}/browser`,
    method: 'GET',
    params: params,
    transformResponse: transformResponse,
    data: null
  }).then(result => ({ data: result.data }))
    .catch(result => ({ error: result.error }))

const getFlow = async ({ url, params = {}, transformResponse }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) => {
  const { id, ...rest } = params
  if (id) {
    return await axiosBaseQuery({
      url: `${url}/flows`,
      method: 'GET',
      params: params,
      transformResponse: transformResponse,
      data: null
    }).then(result => ({ data: result.data }))
      .catch(result => {
        if (result?.error?.status === 410) {
          return createFlow({
            url,
            transformResponse,
            params: { ...rest }
          })
        } else {
          return { error: result.error }
        }
      })
  } else {
    return await createFlow({
      url,
      transformResponse,
      params: { ...rest }
    })
  }
}

const completeFlow = async ({ url, data, params }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) =>
  await axiosBaseQuery({
    url: `${url}`,
    method: 'POST',
    data: data,
    params: params
  }).then(result => ({ data: result.data }))
    .catch(result => result)

const generateOryEndpoints = (builder: EndpointBuilder<any, any, any>) => {
  const endpoints = {} as OryEndpointDefenitions

  endpointRootNames.forEach((endpoint) => {
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
        }
      })
    })

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
