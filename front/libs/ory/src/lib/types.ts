import { AxiosRequestConfig } from 'axios'
import { MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export const endpointRootNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
] as const

export type Platform = 'mobile' | 'browser'

import { LoginFlow, SettingsFlow, RegistrationFlow, LogoutFlow, VerificationFlow, RecoveryFlow } from '@ory/client'

export type EndpointRootNames = typeof endpointRootNames[number]

export type FlowTypes = SettingsFlow | LoginFlow | RegistrationFlow | LogoutFlow | VerificationFlow | RecoveryFlow
export type TransformedFlow<F extends FlowTypes> = F & { csrf_token: string }

export type AxiosBaseQueryConfig = {
  url: string
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  transformResponse?: AxiosRequestConfig['transformResponse']
}

export type FlowType<T extends EndpointRootNames> =
  T extends 'settings' ? TransformedFlow<SettingsFlow> :
  T extends 'login' ? TransformedFlow<LoginFlow> :
  T extends 'registration' ? TransformedFlow<RegistrationFlow> :
  T extends 'logout' ? TransformedFlow<LogoutFlow> :
  T extends 'verification' ? TransformedFlow<VerificationFlow> :
  T extends 'recovery' ? TransformedFlow<RecoveryFlow> :
  never

export type TOryEndpoint<TName extends EndpointRootNames, TType extends 'get' | 'complete'> =
  TType extends 'get' ? QueryDefinition<any, any, any, FlowType<TName>, any> :
  TType extends 'complete' ? MutationDefinition<any, any, any, FlowType<TName>, any> :
  never

export type OryGetFlowEndpoint<TName extends EndpointRootNames> = TOryEndpoint<TName, 'get'>

export type OryCompleteFlowEndpoint<TName extends EndpointRootNames> = TOryEndpoint<TName, 'complete'>

export type GetEndpointName<TName extends EndpointRootNames> = `get${Capitalize<TName>}Flow`
export type CompleteEndpointName<TName extends EndpointRootNames> = `complete${Capitalize<TName>}Flow`

export type OryEndpointDefenitions = {
  [K in EndpointRootNames as GetEndpointName<K>]: OryGetFlowEndpoint<K>
} & {
    [K in EndpointRootNames as CompleteEndpointName<K>]: OryCompleteFlowEndpoint<K>
  } & {
    getUpdatedLogoutFlow: OryGetFlowEndpoint<'logout'>
  }

export type OryAxiosQueryConfig = Omit<AxiosBaseQueryConfig, 'method' | 'withCredentials'>
