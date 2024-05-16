import { useSearchParams } from 'react-router-dom'

import RecoveryForm from './Recovery'
import ActivationForm from './Activation'

const Main = () => {
    const [searchParams] = useSearchParams()

    return searchParams.get('code') ? <ActivationForm /> : <RecoveryForm />
}

export default Main
