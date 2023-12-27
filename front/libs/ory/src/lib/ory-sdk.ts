import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

type AxiosBaseQueryConfig = AxiosRequestConfig<any>

export const axiosBaseQuery = (config: AxiosBaseQueryConfig) => {
  const oryBaseUrl = import.meta.env.VITE_ORY_API_URI;
  const { url, ...rest } = config
  return axios({
    url: oryBaseUrl + url,
    withCredentials: true,
    ...rest,
  }).then((response: AxiosResponse) => ({ data: response.data }))
    .catch((error: AxiosError) => {
      console.log('axiosBaseQuery error.response', error.response)
      throw {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message
        },
      }
    })
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
    params: params,
    transformResponse: () => { },
  }).then(result => ({ data: result.data }))
    .catch(result => ({ error: result.error }))

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
