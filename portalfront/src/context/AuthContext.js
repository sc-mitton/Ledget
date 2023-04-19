import React from 'react'
import { createContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import apiAuth from '../api/axios'

const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [tokenExpiration, setTokenExpiration] = useState('')
    const [loading, setLoading] = useState(true)

    // Get the interval of the token expiration
    // since the jwt expiration comes as a timestamp
    const getRefreshInterval = (timestamp) => {
        const nowTimestamp = Math.floor(Date.now() / 1000)
        let timer = timestamp - nowTimestamp
        timer = Math.floor(timer * .95) * 1000
        return timer
    }
    const isExpired = (timestamp) => {
        return (timestamp ?
            timestamp < Math.floor(Date.now() / 1000)
            : null)
    }

    // Check if the token is expired on page load
    useEffect(() => {
        setTokenExpiration(
            sessionStorage.getItem('access_token_expiration')
        )
        if (tokenExpiration && isExpired(tokenExpiration)) {
            updateToken()
        }
        setLoading(false)
    }, [])

    // Refresh the token every 95% of the expiration time
    useEffect(() => {
        if (tokenExpiration && !isExpired(tokenExpiration)) {
            let interval = setInterval(() => {
                updateToken()
            }, getRefreshInterval(tokenExpiration))
            return () => clearInterval(interval)
        }
    }, [tokenExpiration])

    let updateToken = async () => {
        apiAuth.post(
            'token/refresh',
        ).then(response => {
            setTokenExpiration(
                response.data.access_token_expiration
            )
            sessionStorage.setItem(
                'access_token_expiration',
                response.data.access_token_expiration
            )
        }).catch((error) => {
            if (error.response) {
                console.log('error.response for logging out')
                console.log(error.response.data.detail)
                // TODO make this better for ui
            } else if (error.request) {
                console.log('error.request for logging out')
                console.log("Server is not responding")
                // TODO make this better for ui
            } else {
                console.log("Hmmm, something went wrong, please try again.")
                // TODO make this better for ui
            }
            logout()
        })
    }

    let logout = async () => {
        await apiAuth.post('logout')
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.detail)
                    // TODO make this better for ui
                } else if (error.request) {
                    console.log("Server is not responding")
                    // TODO make this better for ui
                } else {
                    console.log("Hmmm, something went wrong, please try again.")
                    // TODO make this better for ui
                }
            }).finally(() => {
                sessionStorage.removeItem('user')
                sessionStorage.removeItem('access_token_expiration')
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
