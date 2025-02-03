import { useState } from 'react';
import { Modal as NativeModal, View, TouchableOpacity } from 'react-native';
import { Plus, Bell, Trash } from 'geist-native-icons';
import { useFieldArray } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@shopify/restyle';

import styles from './styles/reminders-modal';
import {
  Box,
  Icon,
  Text,
  Button,
  Seperator,
  Modal,
  InputLabel,
} from '@ledget/native-ui';
import type { ModalProps } from './types';

const SchedulerModal = (props: ModalProps) => {
  const [period, setPeriod] = useState<'day' | 'week'>('day');
  const [offset, setOffset] = useState<string>('1');
  const [showModal, setShowModal] = useState(false);
  const [dayOptions, setDayOptions] = useState<number[]>(
    Array.from({ length: 31 }, (_, i) => i + 1)
  );
  const [weekOptions, setWeekOptions] = useState<number[]>(
    Array.from({ length: 4 }, (_, i) => i + 1)
  );

  const theme = useTheme();

  const { append, remove, fields } = useFieldArray({
    control: props.control,
    name: 'reminders',
  });

  const handleSave = () => {
    append({ period, offset: parseInt(offset) });
    setShowModal(false);
    if (period === 'day') {
      const fiteredDays = dayOptions.filter((day) => day !== parseInt(offset));
      setDayOptions(fiteredDays);
      setOffset(`${fiteredDays[0]}`);
    } else {
      const fiteredWeeks = weekOptions.filter(
        (week) => week !== parseInt(offset)
      );
      setWeekOptions([...fiteredWeeks]);
      setOffset(`${fiteredWeeks[0]}`);
    }
  };

  const handleRemove = (index: number) => {
    const { period, offset } = fields[index];
    remove(index);
    if (period === 'day') {
      setDayOptions((prev) => [...prev, offset].sort((a, b) => a - b));
    } else {
      setWeekOptions((prev) => [...prev, offset].sort((a, b) => a - b));
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View>
      <InputLabel>Reminders</InputLabel>
      <View style={styles.fields}>
        {fields.map((field, index) => (
          <>
            <View style={styles.field}>
              <Text>
                {field.offset} {`${field.period}${field.offset > 1 ? 's' : ''}`}
              </Text>
              <TouchableOpacity onPress={() => handleRemove(index)}>
                <Icon icon={Trash} color="alert" />
              </TouchableOpacity>
            </View>
            {index !== 3 && (
              <Box variant="divider" backgroundColor="modalSeperator" />
            )}
          </>
        ))}
        {fields.length < 4 && (
          <Button
            style={styles.inputButton}
            onPress={() => setShowModal(true)}
            label="Add"
            paddingVertical="xs"
            paddingHorizontal="m"
            borderRadius="s"
            backgroundColor="inputBackground"
            borderColor="inputBorder"
            borderWidth={1.5}
            textColor="placeholderText"
          >
            <View style={styles.plusIcon}>
              <Icon
                icon={Plus}
                color="placeholderText"
                size={16}
                strokeWidth={2}
              />
            </View>
          </Button>
        )}
      </View>
      <NativeModal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <Modal
          position="centerFloat"
          hasExitButton={false}
          hasOverlay={true}
          onClose={() => setShowModal(false)}
        >
          <View style={styles.header}>
            <Button
              label="Cancel"
              textColor="blueText"
              onPress={() => handleCancel()}
            />
            <View style={styles.centerHeader}>
              <Icon icon={Bell} size={16} />
              <Text>Reminder</Text>
            </View>
            <Button
              label="Done"
              textColor="blueText"
              onPress={() => handleSave()}
            />
          </View>
          <Seperator backgroundColor="modalSeperator" />
          <View style={styles.pickers}>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                itemStyle={[
                  { color: theme.colors.mainText },
                  styles.pickerItem,
                ]}
                selectedValue={period}
                onValueChange={(itemValue, itemIndex) => setPeriod(itemValue)}
              >
                <Picker.Item label="Days" value="day" />
                <Picker.Item label="Weeks" value="week" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                itemStyle={[
                  { color: theme.colors.mainText },
                  styles.pickerItem,
                ]}
                selectedValue={offset}
                onValueChange={(itemValue, itemIndex) => setOffset(itemValue)}
              >
                {period === 'day' &&
                  dayOptions.map((day) => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
                {period === 'week' &&
                  weekOptions.map((week) => (
                    <Picker.Item
                      key={week}
                      label={week.toString()}
                      value={week}
                    />
                  ))}
              </Picker>
            </View>
          </View>
        </Modal>
      </NativeModal>
    </View>
  );
};

export default SchedulerModal;
