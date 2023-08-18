import React from 'react'

import withModal from './withModal'

const withSmallModal = (Component) => {
    const ModalComponent = withModal(Component)


    return (props) => {
        return <ModalComponent maxWidth="300px" {...props} />
    }
}

export default withSmallModal
