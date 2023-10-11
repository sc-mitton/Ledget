import { Outlet } from 'react-router-dom'

import './styles/Main.css'
import { useGetDevicesQuery } from '@features/authSlice'
import { ShimmerDiv } from '@ledget/shared-ui'
import Devices from './Devices'
import Mfa from './Mfa'
import Authentication from './Authentication'


const Main = () => {
    const { data: devices, isLoading } = useGetDevicesQuery()

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1>Security</h1>
                <Devices devices={devices} />
                <Authentication />
                <Mfa />
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Main
