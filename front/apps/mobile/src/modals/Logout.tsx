import React from 'react';
import { useEffect, useState } from 'react';
import { Alert, View, Platform } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { LogOut } from 'geist-native-icons';

import styles from './styles/logout';
import sharedStyles from './styles/shared';
import { Text, Header2, Button, SubmitButton, Modal, Icon, Seperator, Box } from '@ledget/native-ui';
import { selectSession, apiSlice, setSession } from '@ledget/shared-features';
import { useAppSelector, useAppDispatch } from '@hooks';
import { IOS_ORY_API_URI, ANDROID_ORY_API_URI } from '@env';
import { ModalScreenProps } from '@types';

const Logout = (props: ModalScreenProps<'Logout'>) => {
  const [seconds, setSeconds] = useState(30);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [quedLogout, setQuedLogout] = useState(false);
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  // useEffect(() => {
  //   seconds <= 0 && setQuedLogout(true);
  // }, [seconds]);

  useEffect(() => {
    if (quedLogout) {
      setIsLoggingOut(true);
      axios.delete(`${Platform.OS === 'ios'
        ? IOS_ORY_API_URI
        : ANDROID_ORY_API_URI}/self-service/logout/api`, {
        data: { session_token: session?.token }
      }).then(() => {
        props.navigation.goBack();
        SecureStore.deleteItemAsync('session');
        dispatch(apiSlice.util.invalidateTags(['User']));
        dispatch(setSession(undefined));
      }).catch(() => {
        setIsLoggingOut(false);
        props.navigation.goBack();
        Alert.alert('Error', 'An error occurred while trying to log you out. Please try again.');
      });
    }
  }, [quedLogout]);

  return (
    <Modal position='centerFloat'>
      <View style={sharedStyles.header}>
        <Text variant='bold' fontSize={20}>Sign Out</Text>
        <Text color='secondaryText'>{`You will be automatically logged out in ${seconds} seconds`}</Text>
      </View>
      <Seperator backgroundColor='modalSeperator' variant='m' />
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            backgroundColor='transparent'
            onPress={() => props.navigation.goBack()}
            variant='mediumGrayMain'
            label='Cancel'
            textColor='secondaryText'
          />
        </View>
        <Box backgroundColor='quinaryText' variant='divider' />
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            backgroundColor='transparent'
            onPress={() => setQuedLogout(true)}
            isSubmitting={isLoggingOut}
            variant='mediumGrayMain'
            textColor='alert'
            label='Log Out'
            labelPlacement='right'
          >
            <Icon icon={LogOut} color='alert' />
          </SubmitButton>
        </View>
      </View>
    </Modal>
  )
};

export default Logout
