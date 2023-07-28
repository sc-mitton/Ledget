import React, { useEffect } from 'react'
import { useState } from 'react'

import { FinicityConnect } from '@finicity/connect-web-sdk'

import withModal from './withModal'
import './styles/Connect.css'

const connectURL = "https://connect2.finicity.com?customerId=6026249842&origin=url&partnerId=2445584185009&signature=48806eaf73c74d3d0a5ced35571edc0f56c68703b50e62b1221298a33dc6b829&timestamp=1684606735822&ttl=1684613935822"



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
