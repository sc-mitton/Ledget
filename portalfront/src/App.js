import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import AnimatedRoutes from './utils/AnimatedRoutes';
import { AuthProvider } from './context/AuthContext';
import "./style/gateway.css"

function App() {

    return (
        <main>
            <BrowserRouter>
                <AuthProvider>
                    <AnimatedRoutes />
                </AuthProvider>
            </BrowserRouter>
        </main >
    )
}

export default App;
