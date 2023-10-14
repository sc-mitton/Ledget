import React, { useEffect, useRef } from 'react'

import _ from 'lodash.groupby'

import './styles/Devices.css'
import { Disclosure } from '@headlessui/react'
import { useDeleteRememberedDeviceMutation, } from '@features/authSlice'
import { IconButtonSubmit, Tooltip } from '@ledget/ui'
import Computer from 'shared-assets/src/icons/Computer.svg'
import Phone from 'shared-assets/src/icons/Phone.svg'
import { ArrowIcon, LogoutIcon, LocationIcon } from '@ledget/assets'


const formatDateTime = (date) => {
    const d = new Date(date)
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
    return d.toLocaleDateString('en-US', options)
}

const Device = (props) => {
    const { device, info, deleteDevice, processingDelete } = props
    const buttonRef = useRef(null)
    const panelRef = useRef(null)
    const iconKey = Object.keys(info[0]).find(
        (key) => key.includes('is_') && info[0][key]
    )

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                buttonRef.current
                && buttonRef.current.getAttribute('data-headlessui-state') === 'open'
                && !buttonRef.current.contains(e.target)
                && !panelRef.current.contains(e.target)
            ) {
                buttonRef.current.click()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="device--container">
            <Disclosure as={React.Fragment}>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            ref={buttonRef}
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
                                    <span>{`${info.length} session${info.length > 1 ? 's' : ''}`}</span>
                                </div>
                                <div className="device-location">
                                    <LocationIcon />
                                    {device.split(',')[2] === undefined ? 'unknown' : device.split(',')[1] + ', ' + device.split(',')[2]}
                                </div>
                            </div>
                            <div className={`discolsure-indicator ${open ? 'open' : ''}`}>
                                <ArrowIcon />
                            </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className={`device-sessions ${open ? 'open' : ''}`} ref={panelRef}>
                            {info.map((session) =>
                                <div key={session.id} className="device-session">
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
                                                    onClick={() => { deleteDevice({ deviceId: session.id }) }}
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
            <h3 className="header2">Devices</h3>
            <div className="inner-window" id="device-list">
                {(groupedDevices).map(([device, info], index) =>
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

export default Devices
