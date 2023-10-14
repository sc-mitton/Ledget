import React from 'react'

import './styles/Switch.css'
import { Switch } from '@headlessui/react'

const DefaultSwitch = ({ checked, onChange, children, ...rest }) => {

    return (
        <Switch.Group>
            <div className="switch--container">
                <Switch.Label>{children}</Switch.Label>
                <Switch
                    checked={checked}
                    onChange={onChange}
                    className={`switch-crib ${checked ? 'enabled' : 'disabled'}`}
                    {...rest}
                >
                    {({ checked: isChecked }) => (
                        <span className={`switch-pill ${isChecked ? 'enabled' : 'disabled'}`} />
                    )}
                </Switch>
            </div>
        </Switch.Group>
    )
}

export default DefaultSwitch
