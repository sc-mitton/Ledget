import React, { useEffect } from 'react'

import { Outlet } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import './styles/Main.css'
import { useGetDevicesQuery, selectSessionIsFresh } from '@features/userSlice'
import { ShimmerDiv, SlimInputButton } from '@ledget/shared-ui'
import Devices from './Devices'
import Mfa from './Mfa'
import Authentication from './Authentication'


const Main = () => {
    const { data: devices, isLoading, isSuccess } = useGetDevicesQuery()
    const dispatch = useDispatch()
    const sessionIsFresh = useSelector(selectSessionIsFresh)

    // See if login of this device is younger than 9 minutes,
    // if so, dispatch sessionIsFresh to true
    useEffect(() => {
        if (isSuccess) {
            const this_device = devices.find((device) => device.current_device)

            if (Date.now() - Date.parse(this_device.last_login) < 9 * 60 * 1000) {
                dispatch({ type: 'user/resetAuthedAt' })
            }

        }
    }, [isSuccess])

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1>Security</h1>
                <Devices devices={devices} />
                <Authentication />
                <Mfa />
                <div id="delete-account--button">
                    <SlimInputButton >
                        Delete Account
                    </SlimInputButton >
                </div>
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Main
