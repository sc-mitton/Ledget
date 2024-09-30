import { useState } from 'react';
import { View, Modal as NativeModal } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Plus } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';

import styles from './styles/alert-input';
import { Modal, Button, Icon, Header2, Seperator, DollarCents } from '@ledget/native-ui';

interface Props {
  onChange: (value: number[]) => void;
  defaultValue?: number[];
  amount: number;
}

const AlertInput = (props: Props) => {
  const [value, setValue] = useState(props.defaultValue || [0]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
    props.onChange(value);
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
            <Header2>Add Alert</Header2>
            <Seperator />
            <View style={styles.sliderContainer}>
              <Slider
                value={value}
                onValueChange={setValue}
                minimumValue={0}
                maximumValue={props.amount}
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
