import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { ColorSchemeProvider } from '@ledget/ui'

import App from './app/app'


const root = ReactDOMClient.createRoot(document?.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <App />
    </ColorSchemeProvider>
  </React.StrictMode>,
)
