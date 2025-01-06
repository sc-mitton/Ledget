import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Modal as NativeModal } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Plus } from 'geist-native-icons';
import { useTheme } from '@shopify/restyle';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { SlotNumbers } from 'react-native-slot-numbers';
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
  const slotNumbersContainer = useRef<View>(null);
  const [showSlotNums, setShowSlotNums] = useState(false);

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

  useEffect(() => {
    const t = setTimeout(() => {
      setShowSlotNums(true);
    }, 100);
    return () => clearTimeout(t);
  }, [open]);

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
            <Header2 marginBottom="xs">Add Alert</Header2>
            <Text
              marginLeft="xs"
              color="tertiaryText"
              fontSize={15}
              marginBottom="xs"
            >
              Get a notification when you pass spending amounts
            </Text>
            <Seperator />
            <View
              style={styles.animatedNumbersContainer}
              ref={slotNumbersContainer}
            >
              {showSlotNums && (
                <SlotNumbers
                  fontStyle={[
                    styles.animatedNumbers,
                    { color: theme.colors.mainText },
                  ]}
                  animateIntermediateValues
                  value={value}
                  easing="out"
                  prefix="$"
                  includeComma={true}
                />
              )}
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                value={value}
                onValueChange={(value) => setValue(value[0])}
                minimumValue={0}
                maximumValue={Big(limit_amount).div(100).toNumber()}
                step={1}
                maximumTrackTintColor={theme.colors.authScreenSeperator}
                minimumTrackTintColor={theme.colors.blueButton}
                thumbTintColor={theme.colors.whiteText}
                thumbStyle={{
                  width: 16,
                  height: 16,
                  shadowColor: theme.colors.blackText,
                  shadowOffset: {
                    width: 0,
                    height: theme.colors.mode === 'dark' ? 3 : 1,
                  },
                  shadowOpacity: theme.colors.mode === 'dark' ? 0.9 : 0.3,
                  shadowRadius: 1,
                }}
              />
            </View>
            <Button variant="grayMain" label="Save" onPress={handleClose} />
          </View>
        </Modal>
      </NativeModal>
    </View>
  );
};

export default AlertInput;
