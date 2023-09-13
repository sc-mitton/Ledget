import axios from "axios"

const API_URL = import.meta.env.VITE_LEDGET_API_URI

const ledget = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const ledgetUnsafe = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export { ledget, ledgetUnsafe }
