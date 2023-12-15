import { useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import { withModal } from '@ledget/ui'
import { useFlow } from '@ledget/ory'
import { useCompleteSettingsFlowMutation, useLazyGetSettingsFlowQuery } from '@features/orySlice'
import { set } from 'react-hook-form'

const UpdatePersonalInfo = withModal((props) => {
    const { flow, fetchFlow, submit, flowStatus } = useFlow(
        useLazyGetSettingsFlowQuery,
        useCompleteSettingsFlowMutation,
        'settings'
    )
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        fetchFlow()
        return () => {
            searchParams.delete('flow')
            setSearchParams(searchParams)
        }
    }, [])

    return (
        <div>
            <h3>Update Personal Info</h3>
            <hr />
            <form>

            </form>
        </div>
    )
})

export default UpdatePersonalInfo
