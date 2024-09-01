import { useEffect } from 'react';
import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { Text, Header2, Button, SubmitButton, Box, Modal } from '@ledget/native-ui'
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
    <Modal position='bottomFloat'>
      <Header2>Are you sure?</Header2>
      <Box marginBottom='l'>
        <Text color='secondaryText'>This will remove the connection to your bank account and all of the data associated with this bank.
          <Text variant='bold'> This action cannot be undone.</Text>
        </Text>
      </Box>
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button variant='mediumGrayMain' onPress={() => props.navigation.goBack()} label='Cancel' />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            variant='main'
            label='Ok'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            onPress={() => deletePlaidItem(props.route.params.id)} />
        </View>
      </View>
    </Modal>
  )
};

export default ConfirmDeletePlaidItem
