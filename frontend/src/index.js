import React from 'react';
import { Auth0Provider } from "@auth0/auth0-react";
import * as ReactDOM from 'react-dom/client';
import "./style/style.css"
import App from './App';
import dotenv from 'dotenv';

dotenv.config();

const root = ReactDOM.createRoot(document.getElementById('root'));
const authClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const authDomain = process.env.REACT_APP_AUTH0_DOMAIN_DEV;

root.render(

    <React.StrictMode>
        <Auth0Provider
            domain={authDomain}
            clientId={authClientId}
            authorizationParams={{
                redirect_uri: "https://ledget.app/app"
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode >,
);
