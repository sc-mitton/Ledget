import { useState, useEffect, useCallback } from "react"

import { UseLazyQuery, UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { EndpointRootNames, OryGetFlowEndpoint, OryCompleteFlowEndpoint } from './types'

export const useNativeFlow = <TFlow extends EndpointRootNames>(
  query: UseLazyQuery<OryGetFlowEndpoint<TFlow>>,
  mutation: UseMutation<OryCompleteFlowEndpoint<TFlow>>,
  flowType: TFlow
) => {
  const [errMsg, setErrMsg] = useState<string[]>()
  const [errId, setErrId] = useState<string | number>('')
  const [aal, setAal] = useState<string | undefined>('')
  const [flowId, setFlowId] = useState<string | undefined>('')
  const [refresh, setRefresh] = useState<boolean | undefined>(false)
  const [mutationCacheKey, setMutationCacheKey] = useState('')

  const [
    getFlow,
    {
      data: flow,
      error: getFlowError,
      isError: isGetFlowError,
      isLoading: isGettingFlow,
      isSuccess: isGetFlowSuccess,
    }
  ] = query()
  const [
    completeFlow,
    {
      data: result,
      error: completeError,
      isLoading: isCompletingFlow,
      isError: isCompleteError,
      isSuccess: isCompleteSuccess,
      isUninitialized: isCompleteUninitialized,
      reset: resetCompleteFlow,
    },
  ] = mutation({ fixedCacheKey: mutationCacheKey })

  useEffect(() => {
    if (flow && 'id' in flow) {
      setFlowId(flow.id)
    }
  }, [flow])

  const fetchFlow = useCallback((args: { aal?: string, refresh?: boolean } | void) => {
    // If the aal param is different, this means a new flow is needed
    // and the search param flow id can't be used

    const aal = args?.aal
    const refresh = args?.refresh
    setAal(aal)
    setRefresh(refresh)

    if (aal === 'aal2') {
      setMutationCacheKey('')
    }

    const params = {
      ...(aal ? { aal: aal } : {}),
      ...(refresh ? { refresh: true } : {}),
      ...((flow && 'id' in flow) ? { id: flow.id } : {})
    }

    getFlow({ params: params }, true)
  }, [flow])

  const submitData = useCallback((data: object) => {
    setErrMsg(undefined)
    setErrId('')

    const params = {
      ...(flowId ? { id: flowId } : {}),
      ...(aal ? { aal: aal } : {}),
      ...(refresh ? { refresh: true } : {}),
    }

    completeFlow({ data: data, params })
  }, [flowId, aal, refresh])

  return {
    flow,
    fetchFlow,
    completeFlow,
    submitData,
    result,
    resetCompleteFlow,
    flowStatus: {
      errMsg,
      errId,
      isGetFlowError,
      isGetFlowSuccess,
      isGettingFlow,
      completeError,
      isCompletingFlow,
      isCompleteError,
      isCompleteSuccess,
      isCompleteUninitialized,
    },
    mutationCacheKey
  }
}
