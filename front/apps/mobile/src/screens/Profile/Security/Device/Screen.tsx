import { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import React from 'react'
import { Smartphone, Trash2 } from 'geist-native-icons'
import { Computer, MapPin2 } from '@ledget/media/native';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';

import styles from './styles';
import { SecurityScreenProps } from '@types'
import {
  useGetDevicesQuery,
  useRemoveRememberedDeviceMutation,
  Device as TDevice
} from '@ledget/shared-features';
import { Box, Text, Icon, SubmitButton, Seperator } from '@ledget/native-ui'
import { useBioAuth } from '@hooks';

const Device = ({ navigation, route }: SecurityScreenProps<'Device'>) => {
  const { data: devices } = useGetDevicesQuery();
  const [groupedDevices, setGroupedDevices] = useState<[string, TDevice[]][]>();
  const [device, setDevice] = useState<[string, TDevice[]]>();
  const [iconKey, setIconKey] = useState<string | undefined>(undefined);
  const [removeDevice, { isLoading: processingDelete, isSuccess: successfulDelete }] =
    useRemoveRememberedDeviceMutation();
  const [removedDevice, setRemovedDevice] = useState('');
  const { bioAuth } = useBioAuth();

  useEffect(() => {
    if (devices) {
      const groupedDevices = Object.entries(
        groupBy(devices, (device) => [device.device_family, device.location])
      );
      setGroupedDevices(groupedDevices);
    }
  }, [devices]);

  useEffect(() => {
    if (groupedDevices) {
      setDevice(
        groupedDevices.find((device) => device[0] === route.params.key.join(','))
      );
    }
  }, [groupedDevices]);

  useEffect(() => {
    if (device) {
      setIconKey(device[1][0].is_mobile ? 'is_mobile' : 'is_pc');
    }
  }, [device]);

  useEffect(() => {
    if (!device && successfulDelete) {
      navigation.goBack()
    }
  }, [device]);

  return (
    <>

      <Box variant='screen' style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant='header2'>
              {device?.[0].split(',')[0]}&nbsp;
            </Text>
            <View style={iconKey === 'is_mobile' ? styles.mobileIcon : styles.pcIcon}>
              <Icon
                color='secondaryText'
                size={iconKey === 'is_pc' ? 52 : 32}
                icon={iconKey === 'is_pc' ? Computer : Smartphone}
              />
            </View>
            <View style={iconKey === 'is_pc' ? styles.pcLocation : styles.mobileLocation}>
              <Icon icon={MapPin2} color='tertiaryText' size={14} />
              <Text color='tertiaryText' >
                {device?.[0].split(',')[2] === undefined
                  ? device?.[0].split(',')[1] ? device?.[0].split(',')[1] : 'Unknown'
                  : device?.[0].split(',')[1] + ', ' + device?.[0].split(',')[2]}
              </Text>
            </View>
          </View>
          <Box variant='nestedContainer' style={styles.sessions}>
            <Text style={styles.boxHeader}>Sessions</Text>
            <Seperator backgroundColor='nestedContainerSeperator' />
            <ScrollView
              style={styles.sessionsScroll}>
              {device?.[1]
                .sort((a, b) => dayjs(a.last_login).isAfter(b.last_login) ? -1 : 1)
                .map((session, index) => (
                  <>
                    <View style={styles.session}>
                      <View style={styles.row}>
                        <Text style={styles.family}>
                          <Text color='tertiaryText' style={styles.familyHeader}>Family           </Text>
                          {session.is_mobile ? session.os_family : session.browser_family}
                        </Text>
                        <Text style={styles.lastLogin}>
                          <Text color='tertiaryText' style={styles.lastLoginHeader}>Last Login    </Text>
                          {dayjs(session.last_login).format('MMM D, YYYY h:mm A')}
                        </Text>
                        {session.current_device &&
                          <Text color='greenText' marginTop='xs'>Current Session</Text>}
                      </View>
                      {!session.current_device &&
                        <SubmitButton
                          style={styles.logoutButton}
                          backgroundColor={processingDelete && removedDevice === session.id ? 'transparent' : 'lightGrayButton'}
                          borderRadius={'m'}
                          onPress={() => {
                            bioAuth(() => {
                              setRemovedDevice(session.id)
                              removeDevice({ deviceId: session.id })
                            })
                          }}
                          isSubmitting={processingDelete && removedDevice === session.id}
                          isSuccess={successfulDelete && removedDevice === session.id}
                        >
                          {({ isSubmitting, isSuccess }) => (
                            <Icon icon={Trash2} color={isSubmitting || isSuccess ? 'transparent' : 'mainText'} />
                          )}
                        </SubmitButton>}
                    </View>
                    {index !== device[1].length - 1 && <Seperator />}
                  </>
                ))}
            </ScrollView>
          </Box>
        </View>
      </Box >
    </>
  )
}

export default Device
