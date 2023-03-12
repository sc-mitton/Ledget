import React from 'react';
import LoginWindow from './components/forms/Login';
import SignUpWindow from './components/forms/SignUp';
import Dashboard from './pages/Dashboard';
import SubscriptionCheckout from './components/forms/SubscriptionCheckout';
import logo from './assets/images/logo.svg'
import "./style/gateway.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
    return (
        <main>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={AddLogoHeader(LoginWindow)} />
                    <Route path="/register" element={AddLogoHeader(SignUpWindow)} />
                    <Route path="/checkout" element={AddLogoHeader(SubscriptionCheckout)} />
                </Routes>
            </BrowserRouter>
        </main>
    )
}

const AddLogoHeader = (Window) => {
    return (
        <div>
            <div className="app-logo" >
                <img src={logo} alt="Ledget" />
            </div>
            <Window />
        </div>
    )
}

export default App
