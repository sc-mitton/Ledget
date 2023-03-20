import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();
const SERVER_DOMAIN = process.env.SERVER_DOMAIN

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(
        () => localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    )
    let [user, setUser] = useState(
        () => {
            const tokens = localStorage.getItem('authTokens');
            if (tokens) {
                const decoded = jwt_decode(tokens);
                if (decoded.exp * 1000 < Date.now()) {
                    // tokens have expired, remove them from local storage and set user to null
                    localStorage.removeItem('authTokens');
                    return null;
                } else {
                    // tokens are still valid, return decoded user object
                    return decoded;
                }
            } else {
                // no tokens in local storage, set user to null
                return null;
            }
        }
    );
    let [loading, setLoading] = useState(true);

    const loginUser = async (event) => {
        event.preventDefault();
        console.log(`${SERVER_DOMAIN}/api/v1/token/`)
        let response = await fetch(`${SERVER_DOMAIN}/api/v1/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': event.target.email.value, 'password': event.target.password.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }
    }

    const registerUser = async (event) => {
        event.preventDefault();
        let response = await fetch(`${SERVER_DOMAIN}/api/v1/user/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': event.target.email.value, 'password': event.target.password.value })
        })
        let data = await response.json()
        console.log('Response', response)
        console.log('Response data: ', data)

        if (response.status === 201) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else if (response.status === 400 && data.email) {
            throw new Error("Email already taken.")
        } else {
            throw new Error("Something went wrong, please try again.")
        }
    }

    const refreshTokens = async () => {
        let response = await fetch(`${SERVER_DOMAIN}/api/v1/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'refresh': authTokens ? authTokens.refresh : null })
        })
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (loading) {
            if (authTokens) {
                refreshTokens()
            } else {
                setLoading(false)
            }
        }

        let interval = setInterval(() => {
            if (authTokens) {
                refreshTokens()
            }
        }, 1000 * 60 * 4)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    };

    let contextData = {
        'user': user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
