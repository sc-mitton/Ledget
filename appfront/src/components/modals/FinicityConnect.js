import React from 'react'

import withModal from '../utils/withModal'


const FinicityConnect = (props) => {
    return (

        <div className="modal-footer">
            <button
                className="cancel-button"
                onClick={() => props.cleanUp()}
            >
                cancel
            </button>
        </div>
    )
}

const FinicityConnectModal = withModal(FinicityConnect)

export default FinicityConnectModal
