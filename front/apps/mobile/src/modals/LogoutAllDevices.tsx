import React from 'react';
import { useEffect } from 'react';
import { View, Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store';

import styles from './styles/logout';
import sharedStyles from './styles/shared';
import { Text, Header, Button, SubmitButton, Modal } from '@ledget/native-ui';
import { useDisableAllSessionsMutation, apiSlice } from '@ledget/shared-features';
import { setSession } from '@ledget/shared-features';
import { useAppDispatch } from '@hooks';
import { ModalScreenProps } from '@types';

const LogoutAllDevices = (props: ModalScreenProps<'LogoutAllDevices'>) => {
  const dispatch = useAppDispatch();
  const [disableAllSessions, { isSuccess, isLoading, isError }] = useDisableAllSessionsMutation();

  useEffect(() => {
    if (isSuccess) {
      SecureStore.deleteItemAsync('session');
      dispatch(apiSlice.util.invalidateTags(['User']));
      dispatch(setSession(undefined));
      props.navigation.goBack();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      props.navigation.goBack();
      Alert.alert('Error', 'An error occurred while trying to log you out. Please try again.');
    }
  }, [isError]);

  return (
    <Modal>
      <View style={styles.text}>
        <Header>Are you sure?</Header>
        <Text color='secondaryText'>
          This will log you out of all devices.
        </Text>
      </View>
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button onPress={() => props.navigation.goBack()} variant='mediumGrayMain' label='Cancel' />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            onPress={() => disableAllSessions()}
            isSubmitting={isLoading}
            isSuccess={isSuccess}
            variant='main'
            label="Yes, I'm sure"
          />
        </View>
      </View>
    </Modal>
  )
};

export default LogoutAllDevices
