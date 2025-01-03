import { useEffect } from 'react';
import { View } from 'react-native';

import sharedStyles from './styles/shared';
import {
  Text,
  Header2,
  Modal,
  Button,
  SubmitButton,
  Box,
} from '@ledget/native-ui';
import { useNativeFlow } from '@ledget/ory';
import {
  useLazyGetSettingsFlowQuery,
  useCompleteSettingsFlowMutation,
} from '@/features/orySlice';
import { ModalScreenProps } from '@types';

const RemoveAuthenticator = (
  props: ModalScreenProps<'RemoveAuthenticator'>
) => {
  const { flow, fetchFlow, flowStatus, submitFlow } = useNativeFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  useEffect(() => {
    fetchFlow();
  }, []);

  const onPress = () => {
    submitFlow({
      method: 'totp',
      totp_unlink: true,
    });
  };

  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      const timeout = setTimeout(() => {
        props.navigation.goBack();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [flowStatus.isCompleteSuccess]);

  return (
    <Modal>
      <Header2>Remove Authenticator App</Header2>
      <Box marginBottom="l">
        <Text color="secondaryText">
          This action will remove the second authentication method from your
          account.
        </Text>
      </Box>
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            variant="mediumGrayMain"
            backgroundColor="modalSeperator"
            onPress={props.navigation.goBack}
            label="Cancel"
          />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            variant="mediumGrayMain"
            backgroundColor="modalSeperator"
            textColor="alert"
            label="Ok"
            isSubmitting={flowStatus.isCompletingFlow}
            isSuccess={flowStatus.isCompleteSuccess}
            onPress={onPress}
          />
        </View>
      </View>
    </Modal>
  );
};

export default RemoveAuthenticator;
