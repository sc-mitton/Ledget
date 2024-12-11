import { useEffect, useState } from 'react';
import { View } from 'react-native'
import { Trash } from 'geist-native-icons';

import sharedStyles from './styles/shared';
import { Text, Seperator, Button, SubmitButton, Icon, Modal, Radios, Box } from '@ledget/native-ui'
import { useDeleteBillMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';

const options = [
  {
    label: 'All, including this month',
    value: 'all',
  },
  {
    label: `Just this month's bill`,
    value: 'single'
  },
  {
    label: 'All future bills',
    value: 'complement'
  }
] as const;

const ConfirmDeleteCategory = (props: ModalScreenProps<'ConfirmDeleteBill'>) => {
  const [radiosValue, setRadiosValue] = useState<typeof options[number]['value']>(options[0].value);

  const [
    deleteBill,
    {
      isLoading: isDeletingItem,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteBillMutation();

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
      <Box style={sharedStyles.header} marginBottom='m'>
        <Text fontSize={20} variant='bold'>Delete Bill</Text>
      </Box>
      <Radios
        onChange={setRadiosValue}
        options={options}
        defaultValue={options[0].value}
      />
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
            variant='mediumGrayMain'
            backgroundColor='modalSeperator'
            label='Delete'
            textColor='alert'
            isSubmitting={isDeletingItem}
            isSuccess={isDeleteSuccess}
            labelPlacement='left'
            onPress={() => deleteBill({
              billId: props.route.params.bill.id,
              data: { instances: radiosValue }
            })}
          >
            <Icon icon={Trash} color='alert' size={16} strokeWidth={2} />
          </SubmitButton>
        </View>
      </View>
    </Modal>
  )
};

export default ConfirmDeleteCategory
