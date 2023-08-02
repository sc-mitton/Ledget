import React from 'react'

import { useNavigate } from 'react-router-dom'

import withModal from './with/withModal'

const Form = () => {
    return (
        <div>CreateBill</div>
    )
}

const Modal = withModal(Form)

export default (props) => {
    const navigate = useNavigate()

    return (
        <Modal
            {...props}
            cleanUp={() => navigate(-1)}
            maxWidth={props.maxWidth || '375px'}
            blur={3}
        />

    )
}
