import React, { useState } from 'react'

import showPassword from './showPassword.svg'
import hidePassword from './hidePassword.svg'

const VisibilityIcon = (props: { mode: boolean, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
    // Needs to be set outside the PasswordInput component
    // to prevent rerendering of the icon
    const [showIcon, setShowIcon] = useState(props.mode)

    return (
        <button
            className="password-visibility-icon"
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                setShowIcon(!showIcon)
                props.onClick(e)
            }}
            aria-label={showIcon ? 'hide' : 'show'}
        >
            <img
                style={{ width: '1.3rem', height: '1.3rem' }}
                src={showIcon ? hidePassword : showPassword}
                alt={showIcon ? 'hide' : 'show'}
            />
        </button>
    )
}

export default VisibilityIcon
