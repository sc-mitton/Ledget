import { Navigate, Outlet } from 'react-router-dom'

export const AuthenticatedRoute = () => (
    JSON.parse(sessionStorage.getItem('user' || null))
        ? <Outlet /> : <Navigate to="/login" />
)

export const UnauthenticatedRoute = () => (
    JSON.parse(sessionStorage.getItem('user' || null))
        ? <Navigate to="/checkout" /> : <Outlet />
)
