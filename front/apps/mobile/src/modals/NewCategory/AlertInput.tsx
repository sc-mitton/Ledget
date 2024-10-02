import { useEffect, useState } from 'react';
import { View, Modal as NativeModal } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Plus } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { SlotText } from 'react-native-slot-text';

import styles from './styles/alert-input';
import { Modal, Button, Icon, Header2, Seperator } from '@ledget/native-ui';
import { categorySchema } from '@ledget/form-schemas';

interface Props {
  control: Control<z.infer<typeof categorySchema>>;
}

const AlertInput = (props: Props) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const { fields, append, remove } = useFieldArray({ control: props.control, name: 'alerts' });
  const limit_amount = useWatch({ control: props.control, name: 'limit_amount' });

  const handleClose = () => {
    setOpen(false);
    append({ percent_amount: value });
  }


  return (
    <>
      <Button
        label='Add Alert'
        textColor='placeholderText'
        onPress={() => setOpen(true)}
      >
        <View style={styles.plusIcon}><Icon icon={Plus} color='placeholderText' /></View>
      </Button>
      <NativeModal
        presentationStyle='overFullScreen'
        visible={open}
        transparent={true}
        animationType='slide'
      >
        <Modal position='centerFloat' onClose={handleClose} hasOverlay={true}>
          <View style={styles.modalContent}>
            <Header2>Slider</Header2>
            <Seperator />
            <View style={styles.animatedNumbersContainer}>
              <SlotText
                fontStyle={styles.animatedNumbers}
                value={`${value}`}
                prefix='$'
                animationDuration={200}
                includeComma={true}
              />
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                value={value}
                onValueChange={(value) => setValue(value[0])}
                minimumValue={0}
                maximumValue={limit_amount || 100}
                step={1}
                maximumTrackTintColor={theme.colors.quinaryText}
                minimumTrackTintColor={theme.colors.blueText}
                thumbTintColor={theme.colors.whiteText}
                thumbStyle={{
                  width: 18,
                  height: 18,
                  shadowColor: theme.colors.navShadow,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 1,
                  shadowRadius: 1,
                }}
              />
            </View>
            <Button
              variant='mediumGrayMain'
              label='Save'
              onPress={handleClose}
            />
          </View>
        </Modal>
      </NativeModal>
    </>
  )
}

export default AlertInput;
