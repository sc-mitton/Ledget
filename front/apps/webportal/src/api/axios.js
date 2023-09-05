import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const ledgetapi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default ledgetapi
