import React from 'react'
import { withModal } from '@ledget/ui'

function HelpContent(props) {

    return (
        <div>
            <h1>Help</h1>
        </div>
    )
}

const Help = withModal(HelpContent)

export default Help

