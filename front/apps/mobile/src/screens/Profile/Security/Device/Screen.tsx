import { useState } from 'react'
import { View, ScrollView } from 'react-native'
import React from 'react'
import { LogOut, Smartphone } from 'geist-native-icons'
import { Computer, MapPin2 } from '@ledget/media/native';
import dayjs from 'dayjs';

import styles from './styles';
import { DeviceScreenProps } from '@types'
import { useDeleteRememberedDeviceMutation } from '@ledget/shared-features';
import { Box, Text, Icon, SubmitButton, Header2, Seperator } from '@ledget/native-ui'

const Device = ({ navigation, route }: DeviceScreenProps) => {
  const [deleteDevice, { isLoading: processingDelete, isSuccess: successfulDelete }] =
    useDeleteRememberedDeviceMutation();
  const [deletingDevice, setDeletingDevice] = useState('');

  const iconKey = Object.keys(route.params.sessions[0]).find(
    (key) => key.includes('is_') && (route.params.sessions as any)[0][key]
  );

  return (
    <Box variant='screen' style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant='header'>
            {route.params.device.split(',')[0]}&nbsp;
          </Text>
          <View style={iconKey === 'is_pc' ? styles.pcLocation : styles.mobileLocation}>
            <Icon icon={MapPin2} color='tertiaryText' size={16} />
            <Text color='tertiaryText' >
              {route.params.device.split(',')[2] === undefined
                ? route.params.device.split(',')[1] ? route.params.device.split(',')[1] : 'Unknown'
                : route.params.device.split(',')[1] + ', ' + route.params.device.split(',')[2]}
            </Text>
          </View>
          <Icon
            size={iconKey === 'is_pc' ? 52 : 32}
            icon={iconKey === 'is_pc' ? Computer : Smartphone}
          />
        </View>
        <Box variant='nestedContainer' style={styles.sessions}>
          <ScrollView
            style={styles.sessionsScroll}>
            {route.params.sessions
              .sort((a, b) => dayjs(a.last_login).isAfter(b.last_login) ? -1 : 1)
              .map((session, index) => (
                <>
                  <View style={styles.session}>
                    <View style={styles.row}>
                      <Text style={styles.family}>
                        <Text color='tertiaryText' style={styles.familyHeader}>Family:  </Text>
                        {session.is_mobile ? session.os_family : session.browser_family}
                      </Text>
                      <Text style={styles.lastLogin}>
                        <Text color='tertiaryText' style={styles.lastLoginHeader}>Last Login:   </Text>
                        {dayjs(session.last_login).format('MMM D, YYYY h:mm A')}
                      </Text>
                      {session.current_device &&
                        <Text color='greenText' marginTop='xs'>Current Session</Text>}
                    </View>
                    {!session.current_device && <SubmitButton
                      style={styles.logoutButton}
                      backgroundColor={processingDelete && deletingDevice === session.id ? 'transparent' : 'grayButton'}
                      borderRadius={8}
                      onPress={() => {
                        setDeletingDevice(session.id)
                        deleteDevice({ deviceId: session.id })
                      }}
                      isSubmitting={processingDelete && deletingDevice === session.id}
                      isSuccess={successfulDelete && deletingDevice === session.id}
                    >
                      {({ isSubmitting, isSuccess }) => (
                        <Icon icon={LogOut} color={isSubmitting || isSuccess ? 'transparent' : 'mainText'} />
                      )}
                    </SubmitButton>}
                  </View>
                  {index !== route.params.sessions.length - 1 && <Seperator />}
                </>
              ))}
          </ScrollView>
        </Box>
      </View>
    </Box >
  )
}

export default Device
