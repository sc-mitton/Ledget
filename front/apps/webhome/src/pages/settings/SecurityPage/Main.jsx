import { Outlet } from 'react-router-dom'

import './styles/Main.scss'
import { useGetDevicesQuery } from '@features/userSlice'
import { ShimmerDiv } from '@ledget/ui'
import Devices from './Devices'
import Mfa from './Mfa'
import Authentication from './Authentication'
import Preferences from './Preferences'


const Main = () => {
    const { data: devices, isLoading } = useGetDevicesQuery()

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1>Security</h1>
                <Devices devices={devices} />
                <Authentication />
                <Mfa />
                <Preferences />
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Main
