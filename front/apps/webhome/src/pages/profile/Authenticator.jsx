import React, { useEffect } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import './styles/Authenticator.css'
import AuthenticatorSetup from './AuthenticatorSetup'
import AuthenticatorConfirm from './AuthenticatorConfirm'
import { useCompleteSettingsFlowMutation } from '@features/orySlice'
import { BackButton, GreenSubmitWithArrow } from '@ledget/shared-ui'
import { withSettingsFlow } from '@utils'

const Authenticator = withSettingsFlow((props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [completeFlow, { isSuccess: completedFlow }] = useCompleteSettingsFlowMutation()
    const { flow, loadingSettingsFlow: isLoading } = props

    useEffect(() => {
        if (completedFlow) {
            useUpdateUserMutation({ authenticator_enabled: true })
        }
    }, [completedFlow])

    const handleSubmitClick = () => {
        const csrf_token_node = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')

        if (location.pathname.includes('authenticator-setup')) {
            completeFlow({
                params: { flowId: flow.id },
                data: {
                    csrf_token: csrf_token_node.attributes.value,
                    method: 'totp',
                    totp_code: totpValue
                }
            })
        } else {
            console.log('deactivate')
        }
    }

    const handleBack = () => {
        const path = location.pathname.split('/').find(path => path.includes('authenticator'))
        switch (path) {
            case 'authenticator-confirm':
                navigate('/profile/security/authenticator-setup')
                break
            default:
                navigate('/profile/security')
                break
        }
    }

    return (
        <div className="padded-content" id="authenticator-page">
            <h1>Authenticator</h1>
            <AnimatePresence mode="wait">
                <motion.div>
                    <Routes
                        path="security"
                        location={location}
                        key={location.pathname.split('/')[1]}
                    >
                        <Route
                            path="authenticator-setup"
                            element={<AuthenticatorSetup flow={flow} loadingFlow={isLoading} />}
                        />
                        <Route path="authenticator-confirm" element={<AuthenticatorConfirm />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <div>
                <BackButton onClick={handleBack} />
                <GreenSubmitWithArrow
                    stroke={'var(--m-text-gray)'}
                    onClick={handleSubmitClick}
                >
                    {location.pathname.includes('authenticator-setup') ? 'Next' : 'Confirm'}
                </GreenSubmitWithArrow>
            </div>
        </div>
    )
})


export default Authenticator
