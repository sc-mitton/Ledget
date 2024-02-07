import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { EndpointBuilder, MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { LoginFlow, SettingsFlow, RegistrationFlow, LogoutFlow, VerificationFlow, RecoveryFlow } from '@ory/client'


const endpointRootNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
] as const

export type EndpointRootNames = typeof endpointRootNames[number]

type FlowTypes = SettingsFlow | LoginFlow | RegistrationFlow | LogoutFlow | VerificationFlow | RecoveryFlow
type TransformedFlow<F extends FlowTypes> = F & { csrf_token: string }

type AxiosBaseQueryConfig = {
  url: string
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  transformResponse?: AxiosRequestConfig['transformResponse']
}

type FlowType<T extends EndpointRootNames> =
  T extends 'settings' ? TransformedFlow<SettingsFlow> :
  T extends 'login' ? TransformedFlow<LoginFlow> :
  T extends 'registration' ? TransformedFlow<RegistrationFlow> :
  T extends 'logout' ? TransformedFlow<LogoutFlow> :
  T extends 'verification' ? TransformedFlow<VerificationFlow> :
  T extends 'recovery' ? TransformedFlow<RecoveryFlow> :
  never

type TOryEndpoint<TName extends EndpointRootNames, TType extends 'get' | 'complete'> =
  TType extends 'get' ? QueryDefinition<any, any, any, FlowType<TName>, any> :
  TType extends 'complete' ? MutationDefinition<any, any, any, FlowType<TName>, any> :
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

const createFlow = async ({ url, params, transformResponse }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) => {
  const data = await axiosBaseQuery({
    url: `${url}/browser`,
    method: 'GET',
    params: params,
    transformResponse: transformResponse,
  })
  return data.error ? { error: data.error } : { data: data.data }
}

const getFlow = async ({ url, params = {}, transformResponse }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) => {
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
        params: { ...rest }
      })
    } else {
      return data.error ? { error: data.error } : { data: data.data }
    }
  } else {
    return createFlow({
      url,
      transformResponse,
      params: { ...rest }
    })
  }
}

const completeFlow = async ({ url, data, params }: Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>) => {
  const responseData = await axiosBaseQuery({
    url: `${url}`,
    method: 'POST',
    data: data,
    params: params
  })
  return responseData.error ? { error: responseData.error } : { data: responseData.data }
}

const generateOryEndpoints = (builder: EndpointBuilder<any, any, any>) => {
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
        }
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
