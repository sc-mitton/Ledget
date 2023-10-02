import axios from "axios"
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_LEDGET_API_URI

const ledgetapi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-CsrfToken': Cookies.get('csrftoken')
    },
    withCredentials: true,
})

export default ledgetapi
