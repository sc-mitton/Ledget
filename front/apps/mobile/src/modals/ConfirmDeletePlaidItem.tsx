import { useEffect } from 'react';
import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { Text, Seperator, Button, SubmitButton, Box, Modal } from '@ledget/native-ui'
import { useDeletePlaidItemMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';

const ConfirmDeletePlaidItem = (props: ModalScreenProps<'ConfirmDeletePlaidItem'>) => {
  const [
    deletePlaidItem,
    {
      isLoading: isDeletingItem,
      isSuccess: isDeleteSuccess
    }
  ] = useDeletePlaidItemMutation();

  useEffect(() => {
    if (isDeleteSuccess) {
      const timeout = setTimeout(() => {
        props.navigation.goBack();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isDeleteSuccess]);

  return (
    <Modal position='centerFloat'>
      <View style={sharedStyles.header}>
        <Text fontSize={20} variant='bold'>Disconnect</Text>
        <Text color='secondaryText'>This will remove the connection to your bank account and all of the data associated with this bank.
          <Text variant='bold'> This action cannot be undone.</Text>
        </Text>
      </View>
      <Seperator variant='m' backgroundColor='modalSeperator' />
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            variant='mediumGrayMain'
            onPress={() => props.navigation.goBack()}
            label='Cancel'
            textColor='secondaryText'
            backgroundColor='transparent'
          />
        </View>
        <Box variant='divider' backgroundColor='quinaryText' />
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            variant='main'
            label='Disconnect'
            textColor='alert'
            backgroundColor='transparent'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            onPress={() => deletePlaidItem(props.route.params.id)} />
        </View>
      </View>
    </Modal>
  )
};

export default ConfirmDeletePlaidItem
