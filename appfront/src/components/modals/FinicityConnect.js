import React from 'react'
import { useState } from 'react'

import withModal from '../utils/withModal'
import './FinicityConnect.css'

const FinicityConnect = (props) => {
    const [loading, setLoading] = useState(true)

    return (
        <>
            <div id="connect-container">
                <iframe seamless width='300px' height='600px'>
                </iframe>
            </div>
            <div id="connect-footer">
                <button
                    className="cancel-button"
                    onClick={() => props.setVisible(false) && props.cleanUp()}
                >
                    cancel
                </button>
            </div>
        </>
    )
}

const FinicityConnectModal = withModal(FinicityConnect)

export default FinicityConnectModal
