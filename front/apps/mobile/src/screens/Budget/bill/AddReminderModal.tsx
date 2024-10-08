import { useEffect, useState } from 'react';
import { Modal as NativeModal, View } from 'react-native';
import { Bell } from 'geist-native-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@shopify/restyle';

import styles from './styles/add-reminder-modal';
import {
  Icon,
  Text,
  Button,
  Seperator,
  Modal,
} from '@ledget/native-ui';
import { Bill, useAddReminderMutation } from '@ledget/shared-features';

interface Props {
  bill: Bill;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const SchedulerModal = (props: Props) => {
  const [period, setPeriod] = useState<'day' | 'week'>('day');
  const [offset, setOffset] = useState<string>('1');
  const [addReminder] = useAddReminderMutation();

  const theme = useTheme();

  const handleSave = () => {
    addReminder({
      offset: parseInt(offset),
      period,
      bill: props.bill.id
    })
    props.setVisible(false);
  }

  return (
    <NativeModal
      visible={props.visible}
      animationType='slide'
      transparent={true}
      onRequestClose={() => props.setVisible(false)}
    >
      <Modal
        position='centerFloat'
        hasExitButton={false}
        hasOverlay={true}
        onClose={() => props.setVisible(false)}
      >
        <View style={styles.header}>
          <Button label='Cancel' textColor='blueText' onPress={() => props.setVisible(false)} />
          <View style={styles.centerHeader}>
            <Icon icon={Bell} size={16} />
            <Text>Reminder</Text>
          </View>
          <Button label='Save' textColor='blueText' onPress={() => handleSave()} />
        </View>
        <Seperator backgroundColor='modalSeperator' />
        <View style={styles.pickers}>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              itemStyle={[{ color: theme.colors.mainText }, styles.pickerItem]}
              selectedValue={period}
              onValueChange={(itemValue, itemIndex) =>
                setPeriod(itemValue)
              }>
              <Picker.Item label="Days" value="day" />
              <Picker.Item label="Weeks" value="week" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              itemStyle={[{ color: theme.colors.mainText }, styles.pickerItem]}
              selectedValue={offset}
              onValueChange={(itemValue, itemIndex) =>
                setOffset(itemValue)
              }>
              {period === 'day' &&
                Array.from({ length: 31 }, (_, i) => i + 1)
                  .filter(d => !props.bill.reminders?.some(r => r.period === 'day' && r.offset === d))
                  .map((day) => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
              {period === 'week' &&
                Array.from({ length: 4 }, (_, i) => i + 1)
                  .filter(w => !props.bill.reminders?.some(r => r.period === 'week' && r.offset === w))
                  .map((week) => (
                    <Picker.Item key={week} label={week.toString()} value={week} />
                  ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </NativeModal>
  )
}

export default SchedulerModal;
