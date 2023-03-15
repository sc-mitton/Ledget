import React from 'react';
import LoginWindow from './components/forms/Login';
import SignUpWindow from './components/forms/SignUp';
import Dashboard from './pages/Dashboard';
import SubscriptionCheckout from './components/forms/SubscriptionCheckout';
import logo from './assets/images/logo.svg'
import "./style/gateway.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import UserContextLayout from './utils/UserContextLayout';
import { AuthProvider } from './context/AuthContext';

function App() {

    return (
        <main>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route element={<PrivateRoutes />} >
                            <Route path="/app" element={<Dashboard />} />
                        </Route>
                        <Route exact path="/login" element={AddLogoHeader(LoginWindow)} />
                        <Route path="/checkout" element={AddLogoHeader(SubscriptionCheckout)} />
                        <Route path="/register" element={AddLogoHeader(SignUpWindow)} />
                    </Routes>
                </Router>
            </AuthProvider>
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
