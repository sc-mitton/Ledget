import React from 'react'

const CsrfToken = ({ csrf }) => {

    return (
        <input
            type="hidden"
            name="csrf_token"
            value={csrf || ""}
        />
    )
}

export default CsrfToken

