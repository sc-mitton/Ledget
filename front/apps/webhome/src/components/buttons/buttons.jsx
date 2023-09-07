import React from 'react'

import './buttons.css'
import { Delete, Grip } from '@ledget/shared-assets'

export const DeleteButton = ({ onClick }) => (
    <div>
        <button
            className={`btn delete-button-show`}
            aria-label="Remove"
            onClick={onClick}
        >
            <Delete width={'1.1em'} height={'1.1em'} />
        </button>
    </div>
)

export const GripButton = (props) => (
    <button
        className="btn grip-btn"
        aria-label="Move"
        draggable-item="true"
        {...props}
    >
        <Grip />
    </button>
)
