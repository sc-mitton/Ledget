import React from 'react';
import * as ReactDOM from 'react-dom/client';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet-async';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const csp = `
  default-src 'self';
  script-src 'self' js.stripe.com cdn.plaid.com m.stripe.network;
  style-src 'self' 'unsafe-inline' cdn.plaid.com fonts.googleapis.com cdn.jsdelivr.net;
  img-src 'self' ${import.meta.env.VITE_LEDGET_API_HOST} cdn.jsdelivr.net data:;
  child-src 'self' cdn.plaid.com js.stripe.com;
  connect-src 'self' cdn.plaid.com api.stripe.com fonts.googleapis.com cdn.jsdelivr.net ${
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
