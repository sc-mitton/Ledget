import axios from "axios"
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_LEDGET_API_URI

const ledgetapi = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

ledgetapi.interceptors.request.use(
    // add csrftoken header
    config => {
        const csrftoken = Cookies.get('csrftoken') || ''
        if (csrftoken) {
            config.headers['X-CsrfToken'] = csrftoken
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

export default ledgetapi
