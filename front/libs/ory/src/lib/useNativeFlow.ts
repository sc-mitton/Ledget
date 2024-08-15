import { useState, useEffect, useCallback } from "react";
import dayjs from 'dayjs';

import { UseLazyQuery, UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { EndpointRootNames, OryGetFlowQueryDefinition, OryCompleteNativeFlowQueryDefinition, NativeFlowResult } from './types';

export const useNativeFlow = <E extends EndpointRootNames>(
  query: UseLazyQuery<OryGetFlowQueryDefinition<E>>,
  mutation: UseMutation<OryCompleteNativeFlowQueryDefinition<E>>,
  endpoint: E
) => {
  const [errMsg, setErrMsg] = useState<string[]>()
  const [errId, setErrId] = useState<string | number>('')
  const [aal, setAal] = useState<string | undefined>('')
  const [flowId, setFlowId] = useState<string | undefined>('')
  const [refresh, setRefresh] = useState<boolean | undefined>(false)

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
  ] = mutation()

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

    const params = {
      ...(aal ? { aal: aal } : {}),
      ...(refresh ? { refresh: true } : {}),
      ...((flow && 'id' in flow) ? { id: flow.id } : {})
    }

    let fetchFromCache = true;
    if (flow && 'expires_at' in flow) {
      fetchFromCache = dayjs(flow.expires_at).subtract(1, 'minute').isAfter(dayjs())
    }

    getFlow({ params: params }, fetchFromCache)
  }, [flow])

  const submitFlow = useCallback((data: object) => {
    setErrMsg(undefined)
    setErrId('')

    const params = flowId ? { flow: flowId } : {};

    completeFlow({ data: data, params });
  }, [flowId, aal, refresh])

  return {
    flow,
    fetchFlow,
    submitFlow,
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
    }
  }
}
