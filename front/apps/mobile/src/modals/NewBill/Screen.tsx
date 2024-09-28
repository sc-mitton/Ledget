import { X } from 'geist-native-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import styles from './styles/screen';
import { Box, Button, Icon } from "@ledget/native-ui"
import { billSchema } from '@ledget/form-schemas';
import { useAddnewBillMutation } from '@ledget/shared-features';
import { ModalScreenProps } from '@types';

const Screen = (props: ModalScreenProps<'NewBill'>) => {
  const { control, handleSubmit } = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
  });

  return (
    <Box backgroundColor='modalBox100' style={styles.modalContent}>
      <Button
        onPress={() => props.navigation.goBack()}
        variant='circleButton'
        style={styles.closeButton}>
        <Icon icon={X} color='secondaryText' />
      </Button>
    </Box>
  )
}
export default Screen
