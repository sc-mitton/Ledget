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

const generateOryEndpoints = (builder) => {

  const endpointDefinitions = [
    {
      name: 'settings',
      keepUnusedDataFor: 60 * 3,
      transformResponse: (data) => {
        const json = JSON.parse(data)
        return {
          id: json.id,
          csrf_token: json.ui?.nodes.find((node) =>
            node.attributes.name === 'csrf_token')?.attributes.value,
          nodes: json.ui?.nodes,
          expires_at: json.expires_at,
        }
      }
    },
    { name: 'login', keepUnusedDataFor: 60 * 3 },
    { name: 'logout' }
  ]

  let generatedEndpoints = {}

  for (const endpoint of endpointDefinitions) {
    const { nane, ...rest } = endpoint
    const baseName = `${endpoint.name.charAt(0).toUpperCase()}${endpoint.name.slice(1)}`

    generatedEndpoints[`get${baseName}Flow`] = builder.query({
      queryFn: (arg) => getFlow({
        url: `/self-service/${endpoint.name}`,
        params: arg?.params,
        transformResponse: endpoint.transformResponse,
      }),
      cacheKey: `get${baseName}Flow`,
      ...rest
    })

    if (endpoint.name === 'logout') { break } // logout flow does not have a complete endpoint

    generatedEndpoints[`complete${baseName}Flow`] = builder.mutation({
      queryFn: (arg) => completeFlow({
        url: `/self-service/${endpoint.name}`,
        params: arg?.params,
        data: arg?.data,
      }),
      cacheKey: `complete${baseName}Flow`,
      ...rest
    })
  }

  generatedEndpoints['getUpdatedLogoutFlow'] = builder.query({
    queryFn: (arg) => axiosBaseQuery({
      url: '/self-service/logout',
      method: 'GET',
      params: { token: arg.token }
    }),
    cacheKey: 'getUpdatedLogoutFlow',
  })

  return generatedEndpoints
}

export const generateEndpoints = generateOryEndpoints
