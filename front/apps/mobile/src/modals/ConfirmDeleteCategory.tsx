import { useEffect } from 'react';
import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { Text, Seperator, Button, SubmitButton, Box, Modal } from '@ledget/native-ui'
import { useRemoveCategoriesMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';

const ConfirmDeleteCategory = (props: ModalScreenProps<'ConfirmDeleteCategory'>) => {
  const [
    deleteCategory,
    {
      isLoading: isDeletingItem,
      isSuccess: isDeleteSuccess
    }
  ] = useRemoveCategoriesMutation();

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
        <Text fontSize={20} variant='bold'>Delete Category</Text>
        <Text color='secondaryText'>This will remove all data related to this category.
          <Text variant='bold'> This action cannot be undone.</Text>
        </Text>
      </View>
      <Seperator variant='m' backgroundColor='modalSeperator' />
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button
            variant='mediumGrayMain'
            backgroundColor='modalSeperator'
            onPress={() => props.navigation.goBack()}
            label='Cancel'
            textColor='secondaryText'
          />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            label='Delete'
            textColor='alert'
            variant='mediumGrayMain'
            backgroundColor='modalSeperator'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            onPress={() => deleteCategory([props.route.params.category.id])} />
        </View>
      </View>
    </Modal>
  )
};

export default ConfirmDeleteCategory
