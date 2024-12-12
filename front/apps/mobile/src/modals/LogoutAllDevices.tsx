import React from 'react';
import { useEffect } from 'react';
import { View, Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store';

import sharedStyles from './styles/shared';
import { Text, Button, SubmitButton, Modal, Seperator } from '@ledget/native-ui';
import { useDisableAllSessionsMutation, apiSlice } from '@ledget/shared-features';
import { setSession } from '@features/authSlice';
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
    <Modal position='centerFloat' hasExitButton={false}>
      <View style={sharedStyles.header}>
        <Text variant='bold' fontSize={20}>Log out of all devices?</Text>
        <Text color='secondaryText'>
          This action can't be undone
        </Text>
      </View>
      <Seperator variant='m' backgroundColor='modalSeperator' />
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            onPress={() => props.navigation.goBack()}
            variant='mediumGrayMain'
            backgroundColor='modalSeperator'
            label='Cancel'
            textColor='secondaryText'
          />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            onPress={() => disableAllSessions()}
            isSubmitting={isLoading}
            isSuccess={isSuccess}
            variant='mediumGrayMain'
            backgroundColor='modalSeperator'
            textColor='alert'
            label="Logout"
          />
        </View>
      </View>
    </Modal>
  )
};

export default LogoutAllDevices
