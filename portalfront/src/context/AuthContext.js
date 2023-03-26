import React from 'react';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiAuth from '../api/axios';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [subscribed, setSubscribed] = useState(false);
    const navigate = useNavigate();
    const [tokenExpiration, setTokenExpiration] = useState('');
    const [loading, setLoading] = useState(true);

    let updateToken = async () => {
        console.log('Updating token...')
        let response = await apiAuth.post(
            'token/refresh/',
        ).then(response => {
            setAuth(response.data.full_name)
            setTokenExpiration(response.data.expiration)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data.detail) // TODO make this better for ui
            } else if (error.request) {
                console.log("Server is not responding") // TODO make this better for ui
            } else {
                console.log("Hmmm, something went wrong, please try again.") // TODO make this better for ui
            }
            logout()
        })

        if (loading) {
            setLoading(false)
        }
    }

    let logout = async () => {
        let response = await api.post(
            'logout/',
            { headers: { 'Content-Type': 'application/json' } },
            { withCredentials: true }
        ).then(response => {
            setAuth({})
            setTokenExpiration('')
            navigate('/login')
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data.detail) // TODO make this better for ui
            } else if (error.request) {
                console.log("Server is not responding") // TODO make this better for ui
            } else {
                console.log("Hmmm, something went wrong, please try again.") // TODO make this better for ui
            }
        })
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
        subscribed,
        setSubscribed,
        setTokenExpiration
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
