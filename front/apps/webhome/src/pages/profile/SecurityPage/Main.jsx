import React from 'react'

import { Outlet } from 'react-router-dom'

import './Security.css'
import { useGetDevicesQuery } from '@features/userSlice'
import { ShimmerDiv } from '@ledget/shared-ui'
import Devices from './Devices'
import Mfa from './Mfa'
import Authentication from './Authentication'


const Main = () => {
    const { data: devices, isLoading } = useGetDevicesQuery()

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1 className="spaced-header">Security</h1>
                <Devices devices={devices} />
                <Mfa />
                <Authentication />
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Main
