import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import RegisterApp from './RegisterApp'
import LoginWindow from './components/forms/Login'
import RecoveryWindow from './components/forms/Recovery'
import { UnauthenticatedRoute } from './utils/PrivateRoutes'

import "./style/portal.css"

function App() {

    return (
        <main>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UnauthenticatedRoute />}>
                        <Route exact path="/" element={<Navigate to="/login" />} />
                        <Route exact path="login" element={<LoginWindow />} />
                        <Route exact path="recovery" element={<RecoveryWindow />} />
                    </Route>
                    <Route path="register/*" element={<RegisterApp />} />
                </Routes>
            </BrowserRouter>
        </main >
    )
}

export default App
