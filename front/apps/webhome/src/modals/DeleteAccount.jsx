import React from 'react'

import { useNavigate } from 'react-router-dom'

import { withSmallModal } from '@ledget/shared-utils'
import { withReAuth } from '@utils'

const DeleteAccount = () => {
    return (
        <div>
            <div>Are you sure?</div>
            <h2>This action can't be undone. All of your account data will lost. </h2>
        </div>
    )
}

const DeleteAccountModal = withReAuth(withSmallModal(DeleteAccount))

export default function () {
    const navigate = useNavigate()
    return (
        <DeleteAccountModal
            blur={1}
            onClose={() => navigate(-1)}
        />
    )
}
