import { useEffect } from 'react';
import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { Text, Modal, Button, SubmitButton, Box, Seperator } from '@ledget/native-ui'
import { useGetCoOwnerQuery, useDeleteCoOwnerMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';

const ConfirmRemoveCoOwner = (props: ModalScreenProps<'ConfirmRemoveCoowner'>) => {
  const [
    deleteCoOwner,
    {
      isLoading: isDeletingItem,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteCoOwnerMutation();
  const { data: coOwner } = useGetCoOwnerQuery();

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
        <Text variant='bold' fontSize={20}>
          Remove From Account
        </Text>
        <Text color='tertiaryText'>
          This action will remove {coOwner?.name.first} from your account. All of their data
          will be deleted.
          <Text variant='bold' color='secondaryText'> This action cannot be undone.</Text>
        </Text>
      </View>
      <Seperator variant='m' backgroundColor='modalSeperator' />
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            variant='mediumGrayMain'
            onPress={props.navigation.goBack}
            backgroundColor='transparent'
            label='Cancel'
          />
        </View>
        <Box variant='divider' backgroundColor='modalSeperator' />
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            variant='main'
            label='Remove'
            textColor='alert'
            backgroundColor='transparent'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            onPress={() => deleteCoOwner()} />
        </View>
      </View>
    </Modal>
  )
};

export default ConfirmRemoveCoOwner
