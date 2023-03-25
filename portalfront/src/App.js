import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import LoginWindow from './components/forms/Login';
import SignUpWindow from './components/forms/SignUp';
import SubscriptionWindow from './components/forms/Subscription';
import Checkout from './components/forms/Checkout';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';
import "./style/gateway.css"


const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
        </div>
    )
}

function App() {

    return (
        <main>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route element={<PrivateRoutes />} >
                            <Route path="/home" element={<Dashboard />} />
                        </Route>
                        <Route exact path="/login" element={<LoginWindow />} />
                        <Route path="/register" element={<SignUpWindow />} />
                        <Route path="/subscription" element={<SubscriptionWindow />} />
                        <Route path="/subscription" element={<SubscriptionWindow />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </main >
    )
}

export default App;
