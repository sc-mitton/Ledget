import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import withModal from './withModal'
import { LoadingRing } from '@components/widgets/Widgets'


function withForm(Component) {

    return (props) => {
        const [confirming, setConfirming] = useState(false)

        return (
            <>
                <Component {...props} />
                <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '8px' }}>
                    <button
                        className='btn-secondary'
                        onClick={() => props.setVisible(false)}
                        tabIndex={0}
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        className='btn-primary-green'
                        onClick={() => setConfirming(true)}
                        tabIndex={0}
                        aria-label="Logout"
                    >
                        <LoadingRing visible={confirming}>
                            <div style={{ color: confirming ? 'transparent' : 'inherit' }}>
                                Save
                            </div>
                        </LoadingRing>
                    </button>
                </div>
            </>
        )
    }
}

function withFormModal(Component) {
    const BaseFormm = withModal(withForm(Component))

    return (props) => {
        const navigate = useNavigate()

        return (
            <BaseFormm
                {...props}
                hasExit={false}
                cleanUp={() => navigate(-1)}
            />
        )
    }

}

export default withFormModal
