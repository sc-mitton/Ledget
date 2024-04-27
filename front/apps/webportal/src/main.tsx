import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { ColorSchemeProvider } from '@ledget/ui'
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";

import App from './app/app'


const root = ReactDOMClient.createRoot(document?.getElementById('root') as HTMLElement)

const csp = `
  default-src 'self';
  script-src 'self' js.stripe.com m.stripe.network;
  style-src 'self';
  img-src 'self' ${import.meta.env.VITE_LEDGET_API_HOST} data:;
  child-src 'self' js.stripe.com;
  connect-src 'self' api.stripe.com ${import.meta.env.VITE_LEDGET_API_HOST} ${import.meta.env.VITE_ORY_API_HOST};
  font-src 'self' fonts.gstatic.com;
`

root.render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <HelmetProvider>
        <Helmet>
          <meta
            httpEquiv="Content-Security-Policy"
            content={csp}
          ></meta>
        </Helmet>
        <App />
      </HelmetProvider>
    </ColorSchemeProvider>
  </React.StrictMode>,
)
