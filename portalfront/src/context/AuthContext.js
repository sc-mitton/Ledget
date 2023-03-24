import React from 'react';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const navigate = useNavigate();
    const [tokenExpiration, setTokenExpiration] = useState('');
    const [loading, setLoading] = useState(true);

    let updateToken = async () => {
        console.log('Updating token...')
        let response = await api.post(
            'token/refresh/',
            { headers: { 'Content-Type': 'application/json' } },
            { withCredentials: true }
        )
        if (response.status === 200) {
            setAuth(response.data.full_name)
            setTokenExpiration(response.data.expiration)
        } else if (response.status === 401) {
            logout()
        } else {
            // TODO handle error with refreshing token
        }

        if (loading) {
            setLoading(false)
        }
    }

    let logout = async () => {
        let response = await api.post(
            'logout/',
            { headers: { 'Content-Type': 'application/json' } },
            { withCredentials: true }
        )
        if (response.status === 200) {
            setAuth({})
            setTokenExpiration('')
            navigate('/login')
        } else {
            // TODO handle error with logging out
        }
    }

    // Get the interval of the token expiration
    // since the jwt expiration comes as a timestamp
    const getRefreshInterval = (timestamp) => {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        let timer = timestamp - nowTimestamp;
        timer = Math.floor(timer * .75) * 1000;
        return timer;
    }
    // Update the token on an interval
    // of it's expiration time
    useEffect(() => {

        if (loading) {
            if (tokenExpiration) {
                updateToken()
            } else {
                setLoading(false)
            }
        }

        let interval = setInterval(() => {
            if (tokenExpiration) {
                updateToken()
            }
        }, getRefreshInterval(tokenExpiration))

        return () => clearInterval(interval)

    }, [tokenExpiration, auth])

    // The context data is what is passed to the child components
    const contextData = {
        auth,
        setAuth,
        setTokenExpiration
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
