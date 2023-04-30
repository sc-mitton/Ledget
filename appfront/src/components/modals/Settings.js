import React from 'react'
import withModal from './withModal'

import { useState } from 'react'

function SettingsContent(props) {
    const [updated, setUpdated] = useState(false)

    return (
        <div>
            <h1>Settings</h1>
        </div>
    )
}

const Settings = withModal(SettingsContent)

export default Settings
