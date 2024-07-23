import React from 'react';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native'
import axios from 'axios';

import styles from './styles/logout';
import { Text, Header, Button, SubmitButton, Box, withBottomModal } from '@ledget/native-ui';
import { selectSession } from '@ledget/shared-features';
import { useAppSelector } from '@hooks';

const Logout = withBottomModal((props) => {
  const [seconds, setSeconds] = useState(30);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [quedLogout, setQuedLogout] = useState(false);
  const session = useAppSelector(selectSession);

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

  // useEffect(() => {
  //   if (quedLogout) {
  //     setIsLoggingOut(true);
  //     axios.delete(`${ORY_API_URI}/self-service/logout/api`, {
  //       data: { session_token: session?.token }
  //     }).then(() => {
  //       props.closeModal();
  //     }).catch(() => {
  //       setIsLoggingOut(false);
  //       props.closeModal();
  //       apiSlice.util.invalidateTags(['User']);
  //       Alert.alert('Error', 'An error occurred while trying to log you out. Please try again.');
  //     });
  //   }
  // }, [quedLogout]);

  return (
    <Box style={styles.content}>
      <View style={styles.text}>
        <Header>Sign Out</Header>
        <Text color='secondaryText'>{`You will be automatically logged out in ${seconds} seconds`}</Text>
      </View>
      <SubmitButton isSubmitting={isLoggingOut} variant='main' label='Log Out' />
      <Button onPress={() => props.closeModal()} variant='borderedGrayMain' label='Cancel' />
    </Box>
  )
});

export default Logout
