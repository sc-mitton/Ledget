import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { groupBy as groupby } from 'lodash-es';

import styles from './styles/devices';
import { BoxHeader, Seperator, Icon, Text, ShimmerBox } from '@ledget/native-ui';
import { Computer, MapPin2 } from '@ledget/media/native';
import { Smartphone } from 'geist-native-icons';
import { useGetDevicesQuery, Device as TDevice } from '@ledget/shared-features';

const Device = ({ device, info }: { device: string; info: TDevice[] }) => {
  const iconKey = Object.keys(info[0]).find(
    (key) => key.includes('is_') && (info as any)[0][key]
  );

  return (
    <View style={styles.device}>
      <Icon icon={iconKey === 'is_desktop' ? Computer : Smartphone} />
      <View style={styles.deviceSummary}>
        <View>
          <Text>{device.split(',')[2]}&nbsp;</Text>
          <Text>{`${info.length} session${info.length > 1 ? 's' : ''}`}</Text>
        </View>
        <View>
          <Icon icon={MapPin2} />
          <Text>
            {device.split(',')[2] === undefined
              ? 'unknown'
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
        shimmering={true}
        variant='nestedContainer'
        numberOfLines={3}
        backgroundColor='nestedContainer'>
        {groupedDevices?.map(([device, info], index) => (
          <>
            <Device key={device} device={device} info={info} />
            {(index !== groupedDevices.length - 1) &&
              <Seperator key={`device-seperator${index}`} variant='s' />}
          </>
        ))}
      </ShimmerBox>
    </>
  )
}

export default Devices
