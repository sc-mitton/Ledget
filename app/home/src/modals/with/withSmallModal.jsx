import React from 'react'

import withModal from './withModal'

export default (Component) => {
    const ModalComponent = withModal(Component)

    return (props) => {
        return <ModalComponent maxWidth="300px" {...props} />
    }
}
