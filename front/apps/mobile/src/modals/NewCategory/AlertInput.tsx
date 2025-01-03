import { useState } from 'react';
import { View, Modal as NativeModal } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Plus } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { SlotText } from 'react-native-slot-numbers';
import { X } from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/alert-input';
import {
  Modal,
  Button,
  Icon,
  Header2,
  Seperator,
  Text,
  InputLabel,
  Box,
} from '@ledget/native-ui';
import { categorySchema } from '@ledget/form-schemas';

interface Props {
  control: Control<z.infer<typeof categorySchema>>;
}

const AlertInput = (props: Props) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: 'alerts',
  });
  const limit_amount = useWatch({
    control: props.control,
    name: 'limit_amount',
  });

  const handleClose = () => {
    setOpen(false);
    if (
      !fields.some(
        (field) =>
          field.percent_amount ===
          Big(value).div(limit_amount).times(100).toNumber()
      ) &&
      value > 0
    ) {
      append({
        percent_amount: Big(value).div(limit_amount).times(100).toNumber(),
      });
    }
    setValue(0);
  };

  return (
    <View style={styles.container}>
      {fields.length > 0 && (
        <>
          <InputLabel>Alerts</InputLabel>
          <View style={styles.alerts}>
            {fields
              .sort((a, b) => a.percent_amount - b.percent_amount)
              .map((field, index) => (
                <View style={styles.alert} key={`alert-${index}`}>
                  <Box
                    backgroundColor="mediumBlueButton"
                    style={styles.indexCircle}
                  >
                    <Text color="blueText" style={styles.indexText}>
                      {index + 1}
                    </Text>
                  </Box>
                  <Text fontSize={18}>
                    {`$${Big(field.percent_amount)
                      .div(100)
                      .times(limit_amount)
                      .toNumber()}`}
                  </Text>
                </View>
              ))}
            <View style={styles.clearButton}>
              <Button
                variant="circleButton"
                backgroundColor="inputBackground"
                onPress={() => fields.forEach((_, index) => remove(index))}
              >
                <Icon icon={X} color="secondaryText" strokeWidth={2} />
              </Button>
            </View>
          </View>
        </>
      )}
      {fields.length <= 4 && (
        <View style={styles.addButton}>
          <Button
            label="Add Alert"
            backgroundColor="inputBackground"
            textColor="placeholderText"
            variant="rectangle"
            onPress={() => setOpen(true)}
          >
            <View style={styles.plusIcon}>
              <Icon icon={Plus} color="placeholderText" />
            </View>
          </Button>
        </View>
      )}
      <NativeModal
        presentationStyle="overFullScreen"
        visible={open}
        transparent={true}
        animationType="slide"
      >
        <Modal position="centerFloat" onClose={handleClose} hasOverlay={true}>
          <View>
            <Header2>Add Alert</Header2>
            <Seperator />
            <View style={styles.animatedNumbersContainer}>
              <SlotText
                fontStyle={[
                  styles.animatedNumbers,
                  { color: theme.colors.mainText },
                ]}
                animateIntermediateValues
                value={value}
                prefix="$"
                easing="out"
                animationDuration={200}
                includeComma={true}
              />
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                value={value}
                onValueChange={(value) => setValue(value[0])}
                minimumValue={0}
                maximumValue={Big(limit_amount).div(100).toNumber()}
                step={1}
                maximumTrackTintColor={theme.colors.authScreenSeperator}
                minimumTrackTintColor={theme.colors.blueText}
                thumbTintColor={theme.colors.whiteText}
                thumbStyle={{
                  width: 18,
                  height: 18,
                  shadowColor: theme.colors.blackText,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.7,
                  shadowRadius: 1,
                }}
              />
            </View>
            <Button
              variant="mediumGrayMain"
              label="Save"
              onPress={handleClose}
            />
          </View>
        </Modal>
      </NativeModal>
    </View>
  );
};

export default AlertInput;
