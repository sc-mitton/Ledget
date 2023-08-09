import React from 'react'

import './styles/Account.css'
import { useGetMeQuery } from '@api/apiSlice'
import Camera from '@assets/icons/Camera'

const ChangeProfilePhoto = () => {
    return (
        <button
            className="btn"
            id="change-photo"
            aria-label="Change profile photo"
        >
            <Camera />
        </button>
    )
}

const Info = () => {
    const { data: user } = useGetMeQuery()

    return (
        <div id="info-container">
            <div>
                <h3 >{`${user?.name.first} ${user?.name.last}`}</h3>
            </div>
            <div>
                <span>{`${user?.email}`}</span>
            </div>
        </div>
    )
}

const Account = () => {
    return (
        <>
            <h1>Account</h1>
            <ChangeProfilePhoto />
            <Info />
        </>
    )
}

export default Account
