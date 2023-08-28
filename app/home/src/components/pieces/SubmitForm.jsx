
import React from 'react'

import { LoadingRing } from '@components/pieces'
import { SubmitButton } from '@components/buttons'

const SubmitForm = ({ submitting, onCancel }) => {

    const styles = {
        display: 'flex',
        justifyContent: 'end',
        position: 'relative',
        zIndex: '0'
    }

    return (
        <div style={styles}>
            <div
                className='btn-scale btn3 btn-scnd'
                onClick={onCancel}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onCancel()
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label="Cancel"
                aria-roledescription="button"
                style={{ cursor: 'pointer', borderRadius: '8px' }}
            >
                Cancel
            </div>
            <SubmitButton submitting={submitting}>
                {Save}
            </SubmitButton>
        </div >
    )
}

export default SubmitForm
