import React from 'react';

import './styles/Text.css';

export const TextInput = ({ children }) => {

    return (
        <div className="input-container">
            {children}
        </div>
    )
}

export const MenuTextInput = ({ children }) => {

    return (
        <div className="menu-text-input-container">
            <div className="input-container">
                {children}
            </div>
        </div>
    )
}
