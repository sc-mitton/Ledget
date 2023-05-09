import React, { useEffect } from 'react'
import { useState } from 'react'

import { FinicityConnect } from '@finicity/connect-web-sdk'

import withModal from '../utils/withModal'
import './Connect.css'

const connectURL = "https://connect2.finicity.com?customerId=6026249842&origin=url&partnerId=2445584185009&signature=6ea19d04a04a4f7948ed3f69ba7311d5be86663ea076a0a0745bb9b537446ce9&timestamp=1683664346353&ttl=1683671546353"



const connectOptions = {
    overlay: 'rgba(199,201,199, 0)',
    selector: '#finicity-connect-container'
}

const Connect = (props) => {

    const connectEventHandlers = {
        onDone: (event) => { console.log(event) },
        onCancel: (event) => {
            FinicityConnect.destroy()
            props.setVisible(false) && props.cleanUp()
        },
        onError: (event) => { console.log(event) },
        onRoute: (event) => { console.log(event) },
        onUser: (event) => { console.log(event) },
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
