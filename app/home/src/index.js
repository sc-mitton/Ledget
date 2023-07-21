
import React from 'react'
import * as ReactDOMClient from 'react-dom/client'

import "./style/style.css"
import App from './App'
import rootReducer from './slices/rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { UserProvider } from './context/UserContext'
const store = configureStore({
    reducer: rootReducer,
})

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        {/* <Provider store={store} >
            <App />
        </Provider> */}
        <UserProvider>
            <App />
        </UserProvider>

    </React.StrictMode>,
)
