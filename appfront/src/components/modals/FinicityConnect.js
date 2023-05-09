import React from 'react'
import { useState } from 'react'

import {
    FinicityConnect,
    ConnectEventHandlers,
    ConnectOptions,
    ConnectDoneEvent,
    ConnectCancelEvent,
    ConnectErrorEvent,
    ConnectRouteEvent
} from '@finicity/connect-web-sdk'

import withModal from '../utils/withModal'
import { LoadingRing } from '../widgets/Widgets'
import './FinicityConnect.css'

const Connect = (props) => {
    const [loading, setLoading] = useState(true)

    const Loading = () => {
        return (
            <div
                id="loading-ring-container"
                style={{
                    width: '340px',
                    height: '670px',
                    padding: '0',
                    margin: '0',
                }}
            >
                <div style={{ scale: '2' }} onClick={() => setLoading(false)}>
                    <LoadingRing />
                </div>
            </div>
        )
    }


    return (
        <div id="finicity-connect-container">
            {loading ? (
                <Loading />
            ) : (
                <iframe
                    seamless
                    width="340px"
                    height="670px"
                />
            )}
            <div id="connect-footer">
                <button
                    className="cancel-button"
                    onClick={() => props.setVisible(false) && props.cleanUp()}
                >
                    cancel
                </button>
            </div>
        </div>
    )
}

const ConnectModal = withModal(Connect)

export default ConnectModal
