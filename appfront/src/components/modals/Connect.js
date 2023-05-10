import React, { useEffect } from 'react'
import { useState } from 'react'

import { FinicityConnect } from '@finicity/connect-web-sdk'

import withModal from '../utils/withModal'
import './Connect.css'

const connectURL = "https://connect2.finicity.com?customerId=6026249842&origin=url&partnerId=2445584185009&signature=15d018b829d44c28af432726fb04946c798053b01d74fea181b90354a7dc60ce&timestamp=1683726183733&ttl=1683733383733"



const connectOptions = {
    overlay: 'rgba(0, 0, 0, 0)',
    selector: '#finicity-connect-container'
}

const Connect = (props) => {

    const onCancel = () => {
        FinicityConnect.destroy()
        props.setVisible(false) && props.cleanUp()
    }

    const onError = (event) => {
        console.log('error', event)
    }

    const connectEventHandlers = {
        onDone: (event) => { console.log('done', event) },
        onCancel: (event) => { onCancel() },
        onError: (event) => { onError },
        onRoute: (event) => { console.log('route', event) },
        onUser: (event) => { console.log('user', event) },
        onLoad: () => { console.log('loaded') }
    }

    useEffect(() => {
        FinicityConnect.destroy()
        FinicityConnect.launch(
            connectURL,
            connectEventHandlers,
            connectOptions
        )
    }, [])

    return (
        <div id="finicity-connect-container">
        </div>
    )
}

const ConnectModal = withModal(Connect)

export default ConnectModal
