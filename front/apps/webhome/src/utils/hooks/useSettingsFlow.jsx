import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useLazyGetSettingsFlowQuery } from '@features/orySlice'

const useSettingsFlow = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [getFlow, { data: flow, isLoading, isSuccess }] = useLazyGetSettingsFlowQuery();

    // Fetch flow on mount
    useEffect(() => {
        getFlow({ flowId: searchParams.get('flow') })
    }, [])

    // Set search params to flow id when flow is fetched
    useEffect(() => {
        if (isSuccess) {
            setSearchParams({ flow: flow.id })
        }
    }, [isSuccess, isLoading])

    return { flow, isLoading }
}

export default useSettingsFlow
