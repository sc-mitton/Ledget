import React, { useEffect, useState } from 'react'

import { useSpring, animated } from '@react-spring/web'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import './styles/CancelSubscription.css'
import { withModal } from '@ledget/ui'
import { withReAuth } from '@utils'
import { RedButton, GrnPrimaryButton, SlideMotionDiv } from '@ledget/ui'
import { useUpdateSubscriptionMutation, useGetSubscriptionQuery } from '@features/userSlice'
import { BakedSelect } from '@components/dropdowns'


export const CancelationWindow = (props) => {
    const [feedback, setFeedback] = useState('')
    const [updateSubscription, { isSuccess, isLoading }] = useUpdateSubscriptionMutation()
    const { data: subscription } = useGetSubscriptionQuery()
    const [cancelationReason, setCancelationReason] = React.useState('')

    const [reasonSprings, reasonApi] = useSpring(() => ({
        from: { transform: 'scale(1)' }
    }))
    const [feedbackSprings, feedbackApi] = useSpring(() => ({
        from: { transform: 'scale(1)' },
    }))

    const pulseConfig = {
        to: async (next, cancel) => {
            await next({ transform: 'scale(1)' })
            await next({ transform: 'scale(1.1)' })
            await next({ transform: 'scale(1)' })
        },
        config: { duration: 150 },
    }

    useEffect(() => {
        isSuccess && props.onClose()
    }, [isSuccess])

    const handleClick = () => {
        if (cancelationReason && feedback) {
            updateSubscription({
                subId: subscription.id,
                cancelAtPeriodEnd: true,
                cancelationReason: cancelationReason,
                feedback: feedback
            })
            return
        }
        !cancelationReason && reasonApi.start({ ...pulseConfig })
        !feedback && feedbackApi.start({ ...pulseConfig })
    }

    return (
        <div id='cancelation-modal--container'>
            <h2>Are you sure?</h2>
            <div className="body">
                Before you go, we'd love to hear why you're leaving
                and what we can do to improve.
            </div>
            <div id="cancellation--container">
                <div>
                    <div>
                        <h4>{'Reason for cancellation'}</h4>
                    </div>
                    <animated.div
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            ...reasonSprings
                        }}
                    >
                        <BakedSelect
                            value={cancelationReason}
                            onChange={setCancelationReason}
                            options={[
                                'Too expensive',
                                'Not enough features',
                                'Not using it enough',
                                'Using another product',
                                'Other'
                            ]}
                        >
                            <span>Reason</span>
                        </BakedSelect>
                    </animated.div>
                </div>
                <div>
                    <div>
                        <h4>{'What did you like about Ledget?'}</h4>
                    </div>
                    <animated.div
                        style={{
                            position: 'relative',
                            zIndex: 0,
                            ...feedbackSprings
                        }}
                    >
                        <BakedSelect
                            value={feedback}
                            onChange={setFeedback}
                            options={[
                                "It's easy to use",
                                "Beautiful user interface",
                                "It's fast",
                                "Syncs with my bank",
                                "Unique features",
                                "Other"
                            ]}
                        >
                            <span>Select&nbsp;&nbsp;</span>
                        </BakedSelect>
                    </animated.div>
                </div>
                <div >
                    <RedButton
                        submitting={isLoading}
                        color="light"
                        onClick={handleClick}
                    >
                        Yes, Cancel
                    </RedButton>
                </div>
            </div>
        </div >
    )
}

const SuccessWindow = (props) => {
    return (
        <div id="success-window--container">
            <h2>Success</h2>
            <div className="body" style={{ margin: '1em 0 1em 0' }}>
                If you change your mind, you can stop the
                cancellation at any time before the end of
                the current billing cycle. After that, your
                account will be deleted along with all of your
                account data.
            </div>
            <div>
            </div>
            <div>
                <GrnPrimaryButton
                    onClick={() => { props.closeModal() }}
                    style={{ float: 'right' }}
                >
                    OK
                </GrnPrimaryButton>
            </div>
        </div>
    )
}

const CancelationModal = withReAuth(withModal((props) => {
    const [{ isSuccess }] = useUpdateSubscriptionMutation()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => { setLoaded(true) }, [])

    return (
        <AnimatePresence mode="wait">
            {isSuccess
                ?
                <SlideMotionDiv first={loaded}>
                    <SuccessWindow {...props} />
                </SlideMotionDiv>
                :
                <SlideMotionDiv last>
                    <CancelationWindow {...props} />
                </SlideMotionDiv>
            }
        </AnimatePresence>
    )
}))

export default function () {
    const navigate = useNavigate()

    return (
        <CancelationModal
            onClose={() => navigate('/profile/details')}
            maxWidth={'22em'}
            blur={2}
        />
    )
}
