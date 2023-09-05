import React from 'react'

import { useNavigate } from 'react-router-dom'

import { withModal } from '@components/hocs'

const Modal = withModal(() => {
    return (
        <div>
            <h2>Update Payment Method</h2>
        </div>
    )
})

const UpdatePayment = (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            cleanUp={() => navigate(-1)}
            maxWidth={props.maxWidth || '375px'}
            minWidth={props.minWidth || '0px'}
            blur={2}
        />
    )
}

export default UpdatePayment
