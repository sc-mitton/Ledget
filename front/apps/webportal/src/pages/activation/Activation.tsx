import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import styles from './styles/activation.module.scss'
import {
    SlideMotionDiv,
    useLoaded,
    PortalWindow,
} from '@ledget/ui'
import { Animation } from './Animation'

import { EmailContextProvider } from './context'
import SendAndConfirmCodeSteps from "./SendAndConfirmCodeSteps"
import AddTraitsAndPasswordSteps from "./AddTraitsPasswordForm"

const Activation = () => {
    const loaded = useLoaded(1000)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (!searchParams.get('step')) {
            searchParams.set('step', 'send-code')
            setSearchParams(searchParams)
        }
    }, [])

    return (
        <div>
            <PortalWindow className={styles.activationFlow}>
                <h2>Join Household</h2>
                <Animation />
                <EmailContextProvider>
                    <AnimatePresence mode='wait'>
                        {[null, 'send-code', 'confirm-code'].includes(searchParams.get('step'))
                            ?
                            <SlideMotionDiv key='activation' position={loaded ? 'first' : 'fixed'}>
                                <SendAndConfirmCodeSteps />
                            </SlideMotionDiv>
                            :
                            <SlideMotionDiv key='activation' position={loaded ? 'last' : 'fixed'}>
                                <AddTraitsAndPasswordSteps />
                            </SlideMotionDiv>
                        }
                    </AnimatePresence>
                </EmailContextProvider>
            </PortalWindow>
        </div>
    )
}

export default Activation
