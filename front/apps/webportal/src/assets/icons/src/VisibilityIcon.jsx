import React, { useState } from 'react'

import showPassword from './showPassword.svg'
import hidePassword from './hidePassword.svg'

const VisibilityIcon = (props) => {
    // Needs to be set outside the PasswordInput component
    // to prevent rerendering of the icon
    const [showIcon, setShowIcon] = useState(props.mode)

    return (
        <button
            className="password-visibility-icon"
            type="button"
            onClick={() => {
                setShowIcon(!showIcon)
                props.onClick()
            }}
            aria-label={showIcon ? 'hide' : 'show'}
        >
            <img
                style={{ width: '1.5rem', height: '1.5rem' }}
                src={showIcon ? hidePassword : showPassword}
                alt={showIcon ? 'hide' : 'show'}
            />
        </button>
    )
}

export default VisibilityIcon
