import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { ColorSchemeProvider } from '@ledget/ui'

import App from './App'


const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <ColorSchemeProvider>
            <App />
        </ColorSchemeProvider>
    </React.StrictMode>,
)
