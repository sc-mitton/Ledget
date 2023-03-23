import React from 'react';
import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import api from '../api/axios';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
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
        } else {
            console.log('Error...')
            // logout()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let logout = () => {
        // TODO
        setAuth({})
        setTokenExpiration('')
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

    // The context data is what is passed to
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
