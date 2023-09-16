import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { useGetMeQuery } from '@features/userSlice'
import { useLazyGetLoginFlowQuery, useCompleteLoginFlowMutation } from '@features/orySlice'
import { GreenSubmitWithArrow, SecondaryButton, PasswordInput, PlainTextInput } from '@ledget/shared-ui'

const withRequireReauth = (Component) => {

    return (props) => {
        const [userIsReauthed, setUserIsReauthed] = useState(false)
        const [searchParams, setSearchParams] = useSearchParams()

        const { data: user } = useGetMeQuery()
        const [getFlow, { data: flow, isLoading: loadingFlow, isSuccess: fetchedFlow }] = useLazyGetLoginFlowQuery()
        const [completeFlow, { isLoading: submittingFlow, isSuccess: completedFlow }] = useCompleteLoginFlowMutation()

        const zoomFramerConfig = {
            initial: { opacity: 0, transform: 'scale(0.95)' },
            animate: { opacity: 1, transform: 'scale(1)' },
            exit: { opacity: 0, transform: 'scale(0.95)' },
            config: { duration: 0.15 }
        }

        // Fetch flow
        useEffect(() => {
            getFlow({
                flowId: searchParams.get('flow'),
                params: {
                    aal: searchParams.get('aal') || 'aal1',
                    refresh: true
                }
            })
        }, [searchParams.get('aal')])

        // Update search params
        useEffect(() => {
            if (fetchedFlow) {
                setSearchParams({
                    flow: flow?.id,
                    aal: searchParams.get('aal') || 'aal1'
                })
            }
        }, [fetchedFlow, searchParams.get('aal')])

        // Handle successful flow completion
        useEffect(() => {
            const aal = searchParams.get('aal')
            const finishedCase1 = completedFlow && !user.authenticator_enabled
            const finishedCase2 = completedFlow && aal === 'aal2'
            const needsAal2 = completedFlow && user.authenticator_enabled && aal === 'aal1'

            if (finishedCase1 || finishedCase2) {
                setSearchParams({})
                setUserIsReauthed(true)
            } else if (needsAal2) {
                setSearchParams({ aal: 'aal2' })
            }
        }, [completedFlow, submittingFlow])

        const handleSubmit = (e) => {
            e.preventDefault()
            const data = new FormData(e.target)
            completeFlow({
                flowId: flow.id,
                data: Object.fromEntries(data)
            })
        }

        const HiddenInputs = () => {
            const nodes = ['csrf_token', 'method', 'identifier']
            return (
                <>
                    {flow.ui.nodes.filter(node => nodes.includes(node.attributes.name))
                        .map(node => (
                            <input
                                key={node.attributes.name}
                                type="hidden"
                                name={node.attributes.name}
                                value={node.attributes.value}
                            />
                        ))}
                </>
            )
        }

        const row1Style = { marginTop: '20px', fontWeight: '500', width: '80%', marginLeft: '2px' }
        const row2Style = { margin: '16px 0 28px 0' }
        const PassWord = () => (
            <>
                <div className="body" style={row1Style}>
                    To make this change, first confirm your login.
                </div>
                <div style={row2Style}>
                    <PasswordInput loading={loadingFlow} required />
                </div>
            </>
        )
        const Totp = () => (
            <>
                <div className="body" style={row1Style}>
                    Enter your authenticator code
                </div>
                <div style={row2Style}>
                    <PlainTextInput name="totp_code" placeholder='Code...' required />
                </div>
            </>
        )

        const ReauthenticateForm = () => (
            <div>
                <h3>Confirm Login</h3>
                <form onSubmit={handleSubmit}>
                    <AnimatePresence method="wait">
                        {searchParams.get('aal') === 'aal1'
                            ?
                            <motion.div
                                initial="visible"
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                duration={0.2}
                                key="aal1"
                            >
                                <PassWord />
                            </motion.div>
                            :
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                duration={0.2}
                                key="aal2"
                            >
                                <Totp />
                            </motion.div>
                        }
                    </AnimatePresence >
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <SecondaryButton onClick={() => props.setVisible(false)}>
                            Cancel
                        </SecondaryButton>
                        <GreenSubmitWithArrow submitting={submittingFlow} stroke={'var(--m-text-gray)'}>
                            Continue
                        </GreenSubmitWithArrow>
                    </div>
                    {flow && <HiddenInputs />}
                </form>
            </div>
        )

        return (
            <AnimatePresence method="wait">
                {userIsReauthed
                    ?
                    <motion.div {...zoomFramerConfig} key="complete">
                        <Component {...props} />
                    </motion.div>
                    :
                    <motion.div {...zoomFramerConfig} key="reauth">
                        <ReauthenticateForm />
                    </motion.div>
                }
                <motion.div />
            </AnimatePresence>
        )
    }
}

export default withRequireReauth
