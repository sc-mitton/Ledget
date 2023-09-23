import axios from 'axios'

export const axiosBaseQuery = async ({ url, method, data, params, transformResponse }) => {
  const oryBaseUrl = import.meta.env.VITE_ORY_API_URI
  try {
    const result = await axios({
      url: oryBaseUrl + url,
      method: method,
      data: data,
      params: params,
      withCredentials: true,
      transformResponse: transformResponse
    })
    return { data: result.data }
  } catch (axiosError) {
    let err = axiosError
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    }
  }
}

const createFlow = async ({ url, params, transformResponse }) => {
  const result = await axiosBaseQuery({
    url: `${url}/browser`,
    method: 'GET',
    params: params,
    transformResponse: transformResponse
  })
  return result.data ? { data: result.data } : { error: result.error }
}

const getFlow = async ({ url, params = {}, transformResponse }) => {
  let result
  const { id, ...rest } = params
  if (id) {
    result = await axiosBaseQuery({
      url: `${url}/flows`,
      method: 'GET',
      params: params,
      transformResponse: transformResponse
    })
  }
  if (!id || result.error?.status === 410) {
    result = await createFlow({
      url,
      transformResponse,
      params: { ...rest }
    })
  }
  return result.data ? { data: result.data } : { error: result.error }
}

const completeFlow = async ({ url, data, params }) => {
  const result = await axiosBaseQuery({
    url: `${url}`,
    method: 'POST',
    data: data,
    params: params,
  })
  return result.data ? { data: result.data } : { error: result.error }
}

const endpointNames = [
  'settings', 'login', 'registration', 'logout', 'verification', 'recovery'
]

const generateOryEndpoints = (builder) => {

  let endpoints = {}
  endpointNames.forEach((endpoint) => {
    const { nane, ...rest } = endpoint
    const baseName = `${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`

    endpoints[`get${baseName}Flow`] = builder.query({
      queryFn: (arg) => getFlow({
        url: `/self-service/${endpoint}`,
        params: arg?.params,
        transformResponse: (data) => {
          const json = JSON.parse(data)
          let filteredData = {}

          const csrf_token = json.ui?.nodes.find((node) => node.attributes.name === 'csrf_token')?.attributes.value
          const keys = ['logout_token', 'ui', 'id', 'expires_at']

          keys.forEach((key) => {
            if (json[key]) filteredData[key] = json[key]
          })

          if (csrf_token) filteredData['csrf_token'] = csrf_token

          return json.error ? json.error : filteredData
        },
        keepUnusedDataFor: 60 * 3
      }),
      cacheKey: `get${baseName}Flow`,
      ...rest
    })

    if (endpoint === 'logout') return

    endpoints[`complete${baseName}Flow`] = builder.mutation({
      queryFn: (arg) => completeFlow({
        url: `/self-service/${endpoint}`,
        params: arg?.params,
        data: arg?.data,
      }),
      cacheKey: `complete${baseName}Flow`,
      ...rest
    })
  })

  endpoints['getUpdatedLogoutFlow'] = builder.query({
    queryFn: (arg) => axiosBaseQuery({
      url: '/self-service/logout',
      method: 'GET',
      params: { token: arg.token },
    }),
    cacheKey: 'getUpdatedLogoutFlow',
  })

  return endpoints
}

export const generateEndpoints = generateOryEndpoints
