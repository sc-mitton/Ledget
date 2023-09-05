import React from 'react'
import * as ReactDOMClient from 'react-dom/client'

import "./style/style.css"
import App from './App'
import { UserProvider } from './context/UserContext'

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>,
)
