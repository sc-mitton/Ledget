import React from 'react';

import './styles/Text.css';

export const TextInput = React.forwardRef((props, ref) => {

    return (
        <div className="input-container">
            <input type="text" {...props} />
            {props.children}
        </div>
    )
})

export const MenuTextInput = React.forwardRef((props, ref) => {

    return (
        <div className="menu-text-input-container">
            <TextInput props={props} >
                {props.children}
            </TextInput>
        </div>
    )
})
