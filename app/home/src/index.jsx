import React from 'react';
import * as ReactDOM from 'react-dom/client';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import rootReducer from '@features/rootReducer';
import { ledgetSlice } from '@api/apiSlice'

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(ledgetSlice.middleware),
})

const root = ReactDOM.createRoot(document.getElementById('root'))


root.render(
    <Provider store={store}>
        <BrowserRouter>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </BrowserRouter>
    </Provider>
)
