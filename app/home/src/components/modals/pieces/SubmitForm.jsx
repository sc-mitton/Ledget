
import React from 'react'

import { LoadingRing } from '@components/pieces'

const SubmitForm = ({ submitting, onCancel }) => {
    return (
        <div style={{ display: 'flex', 'justifyContent': 'end', margin: '0px 4px' }}>
            <div
                className='btn-scale btn3 btn-scnd'
                onClick={onCancel}
                tabIndex={0}
                role="button"
                aria-label="Cancel"
                aria-roledescription="button"
                style={{ cursor: 'pointer', borderRadius: '8px' }}
            >
                Cancel
            </div>
            <button
                className='btn-grn btn3'
                type="submit"
                aria-label="Save"
                tabIndex={0}
            >
                <LoadingRing visible={submitting}>
                    <div style={{ color: submitting ? 'transparent' : 'inherit' }}>
                        Save
                    </div>
                </LoadingRing>
            </button>
        </div >
    )
}

export default SubmitForm
