import React, { useEffect, useRef } from 'react'

import _ from 'lodash.groupby'

import './styles/Devices.scss'
import { Disclosure } from '@headlessui/react'
import { useDeleteRememberedDeviceMutation, } from '@features/authSlice'
import { Device as DeviceType, User } from '@features/userSlice'
import { IconButtonSubmit, Tooltip } from '@ledget/ui'
import { ArrowIcon, LogoutIcon, LocationIcon, ComputerIcon, PhoneIcon } from '@ledget/media'
import { ReAuthProtected } from '@utils/withReAuth'

const formatDateTime = (date: string | number) => {
    const d = new Date(date)
    return d.toLocaleDateString(
        'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })
}

const Device = (props: { device: string, info: DeviceType[] }) => {
    const [deleteDevice, { isLoading: processingDelete }] = useDeleteRememberedDeviceMutation()

    const { device, info } = props
    const buttonRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const iconKey = Object.keys(info[0]).find(
        (key) => key.includes('is_') && info[0][key]
    )

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                buttonRef.current
                && buttonRef.current.getAttribute('data-headlessui-state') === 'open'
                && !buttonRef.current.contains(e.target as Node)
                && !panelRef.current?.contains(e.target as Node)
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
                                {iconKey === 'is_pc' && <ComputerIcon />}
                                {iconKey === 'is_mobile' && <PhoneIcon />}
                                {!iconKey && <ComputerIcon />}
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
                                        <div>Browser</div>
                                        <div>{session.browser_family}</div>
                                        <div>Last Login </div>
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
                                                <ReAuthProtected requiredAal={'aal1'}>
                                                    {({ onReAuth }) => (
                                                        <IconButtonSubmit
                                                            submitting={processingDelete}
                                                            onClick={() => {
                                                                onReAuth({
                                                                    fn: deleteDevice,
                                                                    args: { deviceId: session.id }
                                                                })
                                                            }}
                                                        >
                                                            <LogoutIcon />
                                                        </IconButtonSubmit>
                                                    )}
                                                </ReAuthProtected>
                                            </Tooltip>}
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

const Devices = ({ devices }: { devices: DeviceType[] }) => {

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
                    />)}
            </div>
        </>
    )
}

export default Devices
