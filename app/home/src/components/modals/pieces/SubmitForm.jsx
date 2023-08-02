
import React from 'react'

import { LoadingRing } from '@components/pieces'

const SubmitForm = ({ submitting, onCancel }) => {

    const styles = {
        display: 'flex',
        justifyContent: 'end',
        margin: '0px 4px 0 4px',
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
