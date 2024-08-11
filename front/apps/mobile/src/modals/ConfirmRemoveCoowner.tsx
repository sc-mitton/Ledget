import { useEffect } from 'react';
import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { Text, Header2, withModal, Button, SubmitButton, Box } from '@ledget/native-ui'
import { useGetCoOwnerQuery, useDeleteCoOwnerMutation } from '@ledget/shared-features';

const ConfirmRemoveCoOwner = withModal((props) => {
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
        props.closeModal();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isDeleteSuccess]);

  return (
    <View>
      <Header2>Are you sure?</Header2>
      <Box marginBottom='l'>
        <Text color='tertiaryText'>This will remove {coOwner?.name.first} from your account.
          <Text variant='bold' color='secondaryText'> This action cannot be undone.</Text>
        </Text>
      </Box>
      <View style={sharedStyles.splitButtons}>
        <View style={sharedStyles.splitButton}>
          <Button variant='mediumGrayMain' onPress={props.closeModal} label='Cancel' />
        </View>
        <View style={sharedStyles.splitButton}>
          <SubmitButton
            variant='main'
            label='Ok'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            onPress={() => deleteCoOwner()} />
        </View>
      </View>
    </View>
  )
});

export default ConfirmRemoveCoOwner
