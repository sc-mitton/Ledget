import { Outlet } from 'react-router-dom'

import styles from './styles/main.module.scss'
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
            <div className={styles.securityPage}>
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
