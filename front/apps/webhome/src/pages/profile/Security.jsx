import React, { useEffect, useRef } from 'react'

import { useNavigate, Outlet } from 'react-router-dom'
import _ from 'lodash.groupby'

import './styles/Security.css'
import { QrIcon } from '@ledget/shared-assets'
import { Tooltip } from "@components/pieces"
import { PlusPill, GrayButton, IconButtonSubmit, ShimmerDiv } from '@ledget/shared-ui'
import { Disclosure } from '@headlessui/react'
import {
    useGetMeQuery,
    useGetDevicesQuery,
    useDeleteRememberedDeviceMutation,
} from '@features/userSlice'
import { ArrowIcon, LogoutIcon, LocationIcon } from '@ledget/shared-assets'
import Computer from '@ledget/shared-assets/src/icons/Computer.svg'
import Phone from '@ledget/shared-assets/src/icons/Phone.svg'

const formatDateTime = (date) => {
    const d = new Date(date)
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
    return d.toLocaleDateString('en-US', options)
}

const AuthenticatorApp = () => {
    const navigate = useNavigate()
    const { data: user } = useGetMeQuery()

    const formatDate = (date) => {
        const d = new Date(date)
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        return d.toLocaleDateString('en-US', options)
    }

    return (
        <div id="authenticator-settings--container">
            {user.mfa_method === 'authenticator'
                ?
                <>
                    <div>
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Added on {formatDate(user.authenticator_enabled_on)}</span>
                    </div>
                    <GrayButton onClick={() => navigate('/profile/security/delete-authenticator')}>
                        remove
                    </GrayButton>
                </>
                :
                <>
                    <div id="authenticator-not-set-up">
                        <QrIcon width={'1.25em'} height={'1.25em'} />
                        <span>Authenticator App</span>
                    </div>
                    <div>
                        <PlusPill onClick={() => navigate('/profile/security/authenticator-setup')} />
                    </div>
                </>
            }
        </div>
    )
}

const Mfa = () => (
    <div>
        <div id="authenticator-settings--header">
            <h3 className="spaced-header2">Multi-Factor Authentication</h3>
        </div>
        <div className="inner-window">
            <AuthenticatorApp />
        </div>
    </div>
)

const Device = ({ key, device, info, onLogout, processingDelete }) => {
    const buttonRef = useRef(null)
    const disclosureRef = useRef(null)

    const iconKey = Object.keys(info[0]).find(
        (key) => key.includes('is_') && info[0][key]
    )

    return (
        <div ref={disclosureRef} key={key} className="device--container">
            <Disclosure as={React.Fragment}>
                {({ open, close }) => (
                    <>
                        <Disclosure.Button
                            key={device}
                            className={`device ${open ? 'open' : 'closed'}`}
                        >
                            <div className="device-icon">
                                {iconKey === 'is_pc' && <img src={Computer} alt="computer" />}
                                {iconKey === 'is_mobile' && <img src={Phone} alt="phone" />}
                                {!iconKey && <img src={Computer} alt="computer" />}
                            </div>
                            <div className="device-info">
                                <div className="device-title">
                                    <span>{device.split(',')[0]}</span>&ndash;
                                    <span>{`${info.length} session ${info.length > 1 ? 's' : ''}`}</span>
                                </div>
                                <div className="device-location">
                                    <LocationIcon />
                                    {device.split(',')[1] + ', ' + device.split(',')[2]}
                                </div>
                            </div>
                            <div className={`discolsure-indicator ${open ? 'open' : ''}`}>
                                <ArrowIcon />
                            </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className={`device-sessions ${open ? 'open' : ''}`}>
                            {info.map((session) =>
                                <div>
                                    <div className="device-session-info">
                                        <div>Browser:</div>
                                        <div>{session.browser_family}</div>
                                        <div>Last Login: </div>
                                        <div>{formatDateTime(session.last_login)}</div>
                                    </div>
                                    <div className={`${session.current_device ? '' : 'logout-device'}`}>
                                        {session.current_device
                                            ?
                                            <span className="current-device">
                                                This Device
                                            </span>
                                            :
                                            <Tooltip
                                                msg={"Logout"}
                                                ariaLabel={"Refresh list"}
                                                style={{ left: '-30%' }}
                                            >
                                                <IconButtonSubmit
                                                    submitting={processingDelete}
                                                    onClick={() => onLogout()}
                                                >
                                                    <LogoutIcon />
                                                </IconButtonSubmit>
                                            </Tooltip>
                                        }
                                    </div>
                                </div>
                            )}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

const Devices = ({ devices }) => {
    const [deleteDevice, { isLoading: processingDelete }] = useDeleteRememberedDeviceMutation()

    // Group by deviceFamily and location
    const groupedDevices = Object.entries(_(devices, (device) => [device.device_family, device.location]))

    return (
        <>
            <h3 className="spaced-header2">Devices</h3>
            <div className="inner-window" id="device-list">
                {(groupedDevices).map(([device, info]) =>
                    <Device
                        key={device}
                        device={device}
                        info={info}
                        processingDelete={processingDelete}
                        deleteDevice={deleteDevice}
                    />)}
                {(groupedDevices).map(([device, info]) =>
                    <Device
                        key={device}
                        device={device}
                        info={info}
                        processingDelete={processingDelete}
                        deleteDevice={deleteDevice}
                    />)}
                {(groupedDevices).map(([device, info]) =>
                    <Device
                        key={device}
                        device={device}
                        info={info}
                        processingDelete={processingDelete}
                        deleteDevice={deleteDevice}
                    />)}
            </div>
        </>
    )
}

const Security = () => {
    const { data: devices, isLoading } = useGetDevicesQuery()

    return (
        <ShimmerDiv shimmering={isLoading}>
            <div className="padded-content" id="security-page">
                <h1 className="spaced-header">Security</h1>
                <Devices devices={devices} />
                <Mfa />
            </div>
            <Outlet />
        </ShimmerDiv>
    )
}

export default Security
