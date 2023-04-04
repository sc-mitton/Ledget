import React from 'react';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import apiAuth from '../api/axios';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [tokenExpiration, setTokenExpiration] = useState('');
    const [loading, setLoading] = useState(true);

    // Get the interval of the token expiration
    // since the jwt expiration comes as a timestamp
    const getRefreshInterval = (timestamp) => {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        let timer = timestamp - nowTimestamp;
        timer = Math.floor(timer * .75) * 1000;
        return timer
    }
    const isExpired = (timestamp) => {
        return (timestamp ?
            timestamp < Math.floor(Date.now() / 1000)
            : null)
    }

    useEffect(() => {
        if (tokenExpiration && isExpired(tokenExpiration)) {
            updateToken()
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (tokenExpiration) {
            let interval = setInterval(() => {
                updateToken()
            }, getRefreshInterval(tokenExpiration))
            return () => clearInterval(interval)
        }
    }, [tokenExpiration])

    let updateToken = async () => {
        console.log('Updating token...')
        let response = await axios.post(
            'token/refresh/',
            { withCredentials: true },
            { 'Content-Type': 'application/json' }
        ).then(
            console.log(response)
        )
        // let response = await apiAuth.post(
        //     'token/refresh/',
        // ).then(response => {
        //     sessionStorage.setItem('user', response.data.user)
        //     setTokenExpiration(response.data.access_token_expiration)
        // }).catch((error) => {
        //     if (error.response) {
        //         console.log(error.response.data.detail) // TODO make this better for ui
        //     } else if (error.request) {
        //         console.log("Server is not responding") // TODO make this better for ui
        //     } else {
        //         console.log("Hmmm, something went wrong, please try again.") // TODO make this better for ui
        //     }
        //     logout()
        // })
    }

    let logout = async () => {
        await apiAuth.post('logout/')
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.detail) // TODO make this better for ui
                } else if (error.request) {
                    console.log("Server is not responding") // TODO make this better for ui
                } else {
                    console.log("Hmmm, something went wrong, please try again.") // TODO make this better for ui
                }
            }).finally(() => {
                setUser({})
                setTokenExpiration('')
                navigate('/login')
            })
    }

    // The context data is what is passed to the child components
    const contextData = {
        setTokenExpiration
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
