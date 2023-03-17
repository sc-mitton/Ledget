import React from 'react';
import LoginWindow from './components/forms/Login';
import SignUpWindow from './components/forms/SignUp';
import Dashboard from './pages/Dashboard';
import SubscriptionCheckout from './components/forms/SubscriptionCheckout';
import logo from './assets/images/logo.svg'
import "./style/gateway.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {

    return (
        <main>
            <Router>
                <Routes>
                    <Route element={<PrivateRoutes />} >
                        <Route path="/app" element={<Dashboard />} />
                    </Route>
                    <Route exact path="/login" element={<LoginWindow />} />
                    <Route path="/checkout" element={<SubscriptionCheckout />} />
                    <Route path="/register" element={<SignUpWindow />} />
                </Routes>
            </Router>
        </main>
    )
}


export default App
