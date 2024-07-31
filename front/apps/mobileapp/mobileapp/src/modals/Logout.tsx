import React from 'react';
import { useEffect, useState } from 'react';
import { Alert, View, Platform } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import styles from './styles/logout';
import { Text, Header, Button, SubmitButton, withBottomModal } from '@ledget/native-ui';
import { selectSession, apiSlice, setSession } from '@ledget/shared-features';
import { useAppSelector, useAppDispatch } from '@hooks';
import { IOS_ORY_API_URI, ANDROID_ORY_API_URI } from '@env';

const Logout = withBottomModal((props) => {
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

  useEffect(() => {
    seconds <= 0 && setQuedLogout(true);
  }, [seconds]);

  useEffect(() => {
    if (quedLogout) {
      setIsLoggingOut(true);
      axios.delete(`${Platform.OS === 'ios'
        ? IOS_ORY_API_URI
        : ANDROID_ORY_API_URI}/self-service/logout/api`, {
        data: { session_token: session?.token }
      }).then(() => {
        props.closeModal();
        SecureStore.deleteItemAsync('session');
        apiSlice.util.invalidateTags(['User']);
        dispatch(setSession(undefined));
      }).catch(() => {
        setIsLoggingOut(false);
        props.closeModal();
        Alert.alert('Error', 'An error occurred while trying to log you out. Please try again.');
      });
    }
  }, [quedLogout]);

  return (
    <View>
      <View style={styles.text}>
        <Header>Sign Out</Header>
        <Text color='secondaryText'>{`You will be automatically logged out in ${seconds} seconds`}</Text>
      </View>
      <SubmitButton onPress={() => setQuedLogout(true)} isSubmitting={isLoggingOut} variant='main' label='Log Out' />
      <Button onPress={() => props.closeModal()} variant='mediumGrayMain' label='Cancel' />
    </View>
  )
});

export default Logout
