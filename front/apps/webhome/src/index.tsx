import React from 'react';
import * as ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ledgetAntTheme } from '@ledget/ui';

import App from './App';
import store from '@features/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <ConfigProvider theme={ledgetAntTheme}>
            <BrowserRouter>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </BrowserRouter>
        </ConfigProvider>
    </Provider>
)
