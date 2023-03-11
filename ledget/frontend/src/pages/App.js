import React from 'react';
import LoginWindow from '../components/forms/Login';
import SignUpWindow from '../components/forms/SignUp';
import logo from '../assets/images/logo.svg'
import "./app.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <div>
            <div className="app-logo">
                <img src={logo} alt="Ledget" />
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginWindow />} />
                    <Route path="/signup" element={<SignUpWindow />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
