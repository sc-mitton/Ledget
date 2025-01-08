import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';

import '@styles/globals.scss';
import App from './app/app';

const root = ReactDOMClient.createRoot(
  document?.getElementById('root') as HTMLElement
);

const csp = `
  default-src 'self';
  script-src 'self' js.stripe.com m.stripe.network ${
    import.meta.env.VITE_ORY_API_HOST
  }/.well-known/ory/webauthn.js;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' ${import.meta.env.VITE_LEDGET_API_HOST} data:;
  child-src 'self' js.stripe.com;
  connect-src 'self' api.stripe.com fonts.googleapis.com ${
    import.meta.env.VITE_LEDGET_API_HOST
  } ${import.meta.env.VITE_ORY_API_HOST};
  font-src 'self' fonts.gstatic.com;
`;

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content={csp}></meta>
      </Helmet>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
