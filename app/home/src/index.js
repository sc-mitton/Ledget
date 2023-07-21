
import React from 'react'
import * as ReactDOMClient from 'react-dom/client'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import "./styles/style.css"
import App from './App'
import rootReducer from './slices/rootReducer'


const store = configureStore({
    reducer: rootReducer,
})

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store} >
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)
