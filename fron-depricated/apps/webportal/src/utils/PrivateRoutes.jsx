import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedCheckout = () => {

    return JSON.parse(sessionStorage.getItem('identifier' || null))
        ? <Outlet /> : <Navigate to="/login" />
}

export const SendRegisteredToCheckout = () => {

    return JSON.parse(sessionStorage.getItem('identifier' || null))
        ? <Navigate to="/checkout" /> : <Outlet />
}
