import { useSearchParams } from "react-router-dom"
import {
    useLazyGetRecoveryFlowQuery,
    useCompleteRecoveryFlowMutation
} from '@features/orySlice'
import { useFlow } from '@ledget/ory'


// Initial Component to show the creation state while the first two submittions are happening

// Second Component to show the form to set the password, first name, last name

// => When done redirect to the main app

const Activation = () => {
    const [searchParams] = useSearchParams()
    const {
        flow,
        fetchFlow,
        submit,
        flowStatus,
        result
    } = useFlow(
        useLazyGetRecoveryFlowQuery,
        useCompleteRecoveryFlowMutation,
        'recovery'
    )

    // Step 1: Initial submittion to get the csrf token

    // Step 2: Submit the form automatically a second time with the csrf token
    // and the activation code

    // Step 3: Allow User to set password, first name, last name

    return (
        <div>

        </div>
    )
}

export default Activation
