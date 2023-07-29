
import React from 'react'

import { LoadingRing } from '@components/pieces'

const SubmitForm = ({ confirming, onCancel }) => {
    return (
        <div style={{ display: 'flex', 'justifyContent': 'end', marginTop: '20px' }}>
            <button
                className='btn-secondary'
                onClick={onCancel}
                tabIndex={0}
                aria-label="Cancel"
            >
                Cancel
            </button>
            <button
                className='btn-primary-green'
                type="submit"
                aria-label="Save"
                tabIndex={0}
            >
                <LoadingRing visible={confirming}>
                    <div style={{ color: confirming ? 'transparent' : 'inherit' }}>
                        Save
                    </div>
                </LoadingRing>
            </button>
        </div>
    )
}

export default SubmitForm
