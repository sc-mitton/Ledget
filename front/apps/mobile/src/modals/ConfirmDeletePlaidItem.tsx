import { useEffect } from 'react';
import { View } from 'react-native'

import { Text, Header2, withModal, Button, SubmitButton, Box } from '@ledget/native-ui'
import { useDeletePlaidItemMutation } from '@ledget/shared-features';

const ConfirmDeletePlaidItem = withModal<{ id: string }>((props) => {
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
        props.closeModal();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isDeleteSuccess]);

  return (
    <View>
      <Header2>Are you sure?</Header2>
      <Box marginBottom='l'>
        <Text color='secondaryText'>This will remove the connection to your bank account and all of the data associated with this bank.
          <Text variant='bold'> This action cannot be undone.</Text>
        </Text>
      </Box>
      <SubmitButton
        variant='main'
        label='Ok'
        isSubmitting={isDeletingItem}
        isSuccess={isDeleteSuccess}
        onPress={() => deletePlaidItem(props.id)} />
      <Button variant='mediumGrayMain' onPress={props.closeModal} label='Cancel' />
    </View>
  )
});

export default ConfirmDeletePlaidItem
