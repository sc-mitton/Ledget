import React, { useEffect, useRef } from 'react';

import { groupBy as groupby } from 'lodash-es';

import styles from './styles/devices.module.scss';
import { Disclosure } from '@headlessui/react';
import {
  useRemoveRememberedDeviceMutation,
  Device as DeviceType,
} from '@ledget/shared-features';
import { IconButtonSubmit, Tooltip, NestedWindowSlimmer } from '@ledget/ui';

import { MapPin2, Computer } from '@ledget/media';
import { ChevronDown, Trash2, Smartphone } from '@geist-ui/icons';
import { ReAuthProtected } from '@utils/withReAuth';

const formatDateTime = (date: string | number) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

const Device = (props: { device: string; info: DeviceType[] }) => {
  const [deleteDevice, { isLoading: processingDelete }] =
    useRemoveRememberedDeviceMutation();

  const { device, info } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const iconKey = Object.keys(info[0]).find(
    (key) => key.includes('is_') && (info as any)[0][key]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        buttonRef.current.getAttribute('data-headlessui-state') === 'open' &&
        !buttonRef.current.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        buttonRef.current.click();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section>
      <Disclosure as={React.Fragment}>
        {({ open }) => (
          <>
            <Disclosure.Button ref={buttonRef} key={device} data-open={open}>
              <div data-icon={iconKey}>
                {iconKey === 'is_mobile' && (
                  <Smartphone className={styles.smartPhoneIcon} />
                )}
                {iconKey === 'is_pc' && <Computer size={'2em'} />}
                {!iconKey && <Computer size={'2em'} />}
              </div>
              <div>
                <div>
                  <span>{device.split(',')[0]}</span>&ndash;
                  <span>{`${info.length} session${
                    info.length > 1 ? 's' : ''
                  }`}</span>
                </div>
                <div>
                  <MapPin2 size={'0.875em'} />
                  <span>
                    {device.split(',')[2] === undefined
                      ? 'unknown'
                      : device.split(',')[1] + ', ' + device.split(',')[2]}
                  </span>
                </div>
              </div>
              <div data-open={open}>
                <ChevronDown className="icon" />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel data-open={open} ref={panelRef}>
              {info.map((session) => (
                <div key={session.id}>
                  <div>
                    {session.is_pc && (
                      <>
                        <div>Browser</div>
                        <div>{session.browser_family}</div>
                      </>
                    )}
                    <div>Last Login </div>
                    <div>{formatDateTime(session.last_login)}</div>
                  </div>
                  <div
                    className={`${
                      session.current_device ? '' : styles.logoutDevice
                    }`}
                  >
                    {session.current_device ? (
                      <span className={styles.currentDevice}>This Device</span>
                    ) : (
                      <ReAuthProtected
                        requiredAal={'aal1'}
                        onReAuth={() => deleteDevice({ deviceId: session.id })}
                      >
                        {({ reAuth, current }) => (
                          <Tooltip msg={'Logout'} ariaLabel={'Refresh list'}>
                            <IconButtonSubmit
                              submitting={processingDelete && current}
                              onClick={() => reAuth()}
                            >
                              <Trash2 className="icon" />
                            </IconButtonSubmit>
                          </Tooltip>
                        )}
                      </ReAuthProtected>
                    )}
                  </div>
                </div>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  );
};

const Devices = ({ devices }: { devices?: DeviceType[] }) => {
  // Group by deviceFamily and location
  const groupedDevices = Object.entries(
    groupby(devices, (device) => [device.device_family, device.location])
  );

  return (
    <section>
      <h4 className="header2">Devices</h4>
      <NestedWindowSlimmer className={styles.deviceList}>
        {groupedDevices.map(([device, info], index) => (
          <Device key={device} device={device} info={info} />
        ))}
      </NestedWindowSlimmer>
    </section>
  );
};

export default Devices;
