import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { groupBy as groupby } from 'lodash-es';

import styles from './styles/devices';
import { BoxHeader, Seperator, Icon, Text, ShimmerBox, ChevronTouchable } from '@ledget/native-ui';
import { Computer, MapPin2 } from '@ledget/media/native';
import { Smartphone } from 'geist-native-icons';
import { useGetDevicesQuery, Device as TDevice } from '@ledget/shared-features';

const Device = ({ device, info }: { device: string; info: TDevice[] }) => {
  const iconKey = Object.keys(info[0]).find(
    (key) => key.includes('is_') && (info as any)[0][key]
  );

  return (
    <View style={styles.device}>
      <View style={styles.deviceIcon}>
        <Icon
          size={iconKey === 'is_pc' ? 30 : undefined}
          icon={iconKey === 'is_pc' ? Computer : Smartphone}
        />
      </View>
      <View style={styles.deviceSummary}>
        <View style={styles.sessionsRow}>
          <Text>{device.split(',')[0]}&nbsp;</Text>
          <Text>{` - ${info.length} session${info.length > 1 ? 's' : ''}`}</Text>
        </View>
        <View style={styles.location}>
          <View style={styles.locationIcon}>
            <Icon icon={MapPin2} size={13} />
          </View>
          <Text fontSize={14} color='secondaryText'>
            {device.split(',')[2] === undefined
              ? device.split(',')[1] ? device.split(',')[1] : 'Unknown'
              : device.split(',')[1] + ', ' + device.split(',')[2]}
          </Text>
        </View>
      </View>
    </View>
  )
}

const Devices = () => {
  const { data: devices } = useGetDevicesQuery();
  const [groupedDevices, setGroupedDevices] = useState<[string, TDevice[]][]>();

  useEffect(() => {
    if (devices) {
      const groupedDevices = Object.entries(
        groupby(devices, (device) => [device.device_family, device.location])
      );
      setGroupedDevices(groupedDevices);
    }
  }, [devices]);

  return (
    <>
      <BoxHeader>Devices</BoxHeader>
      <ShimmerBox
        shimmering={!devices}
        variant='nestedContainer'
        numberOfLines={3}
        style={styles.devices}
        backgroundColor='nestedContainer'>
        {groupedDevices?.map(([device, info], index) => (
          <>
            <ChevronTouchable key={`device${index}`}>
              <Device key={device} device={device} info={info} />
            </ChevronTouchable>
            {(index !== groupedDevices.length - 1) &&
              <Seperator key={`device-seperator${index}`} variant='s' />}
          </>
        ))}
      </ShimmerBox>
    </>
  )
}

export default Devices
