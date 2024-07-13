import { AxiosRequestConfig } from 'axios'
import { MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { LoginFlow, SettingsFlow, RegistrationFlow, LogoutFlow, VerificationFlow, RecoveryFlow, SuccessfulNativeLogin } from '@ory/client'

export const endpointRootNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
] as const

export type Platform = 'mobile' | 'browser'

export type EndpointRootNames = typeof endpointRootNames[number]

export type FlowTypes = SettingsFlow | LoginFlow | RegistrationFlow | LogoutFlow | VerificationFlow | RecoveryFlow
export type Flow<F extends FlowTypes> = F & { csrf_token: string }

type FlowResult<N extends EndpointRootNames> =
  N extends 'settings' ? Flow<SettingsFlow> :
  N extends 'login' ? Flow<LoginFlow> :
  N extends 'registration' ? Flow<RegistrationFlow> :
  N extends 'logout' ? Flow<LogoutFlow> :
  N extends 'verification' ? Flow<VerificationFlow> :
  N extends 'recovery' ? Flow<RecoveryFlow> :
  never

export type NativeFlowResult<N extends EndpointRootNames> =
  N extends 'login' ? SuccessfulNativeLogin :
  N extends 'recovery' ? SuccessfulNativeLogin :
  N extends EndpointRootNames ? FlowResult<N> :
  never

export type OryGetFlowQueryDefinition<TName extends EndpointRootNames> = QueryDefinition<any, any, any, FlowResult<TName>, any>

export type OryCompleteFlowQueryDefinition<TName extends EndpointRootNames> = MutationDefinition<any, any, any, FlowResult<TName>, any>

export type OryCompleteNativeFlowQueryDefinition<TName extends EndpointRootNames> = MutationDefinition<any, any, any, NativeFlowResult<TName>, any>

export type GetEndpointName<TName extends EndpointRootNames> = `get${Capitalize<TName>}Flow`
export type CompleteEndpointName<TName extends EndpointRootNames> = `complete${Capitalize<TName>}Flow`

//
export type OryEndpointDefenitions = {
  [K in EndpointRootNames as GetEndpointName<K>]: OryGetFlowQueryDefinition<K>
} & {
  [K in EndpointRootNames as CompleteEndpointName<K>]: OryCompleteFlowQueryDefinition<K>
} & {
  getUpdatedLogoutFlow: OryGetFlowQueryDefinition<'logout'>
}

export type OryNativeEndpointDefenitions = {
  [K in EndpointRootNames as GetEndpointName<K>]: OryGetFlowQueryDefinition<K>
} & {
  [K in EndpointRootNames as CompleteEndpointName<K>]: OryCompleteNativeFlowQueryDefinition<K>
} & {
  getUpdatedLogoutFlow: OryGetFlowQueryDefinition<'logout'>
}

//
export type AxiosBaseQueryConfig = {
  url: string
  method: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  transformResponse?: AxiosRequestConfig['transformResponse']
  withCredentials?: boolean
}

export type OryAxiosQueryConfig = Omit<AxiosBaseQueryConfig, 'method'>
