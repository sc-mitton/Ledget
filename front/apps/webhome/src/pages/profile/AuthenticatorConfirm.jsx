import React from 'react'

import { TextInput } from '@ledget/shared-ui'

const AuthenticatorConfirm = () => {
    return (
        <di id="confirm-code--container">
            <div>
                <label htmlFor="code">Enter the code from your authenticator app</label>
                <TextInput>
                    <input id="code" type="text" placeholder="Code" />
                </TextInput>
            </div>
        </di>
    )
}

export default AuthenticatorConfirm
