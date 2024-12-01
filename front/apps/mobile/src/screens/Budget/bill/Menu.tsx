import { useState } from 'react';
import { View } from 'react-native';
import { Edit2, MoreHorizontal, Plus, Trash, Bell } from 'geist-native-icons';

import styles from './styles/menu';
import { Menu, Box, Icon } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';
import SchedulerModal from './AddReminderModal';

export default function BakedMenu(props: BudgetScreenProps<'Bill'>) {
  const [showReminderModal, setShowReminderModal] = useState(false);

  return (
    <View style={styles.menu}>
      <SchedulerModal
        bill={props.route.params.bill}
        visible={showReminderModal}
        setVisible={setShowReminderModal}
      />
      <Menu
        as='menu'
        placement='right'
        items={[
          {
            label: 'Edit',
            icon: () => <Icon icon={Edit2} size={16} strokeWidth={2} />,
            onSelect: () =>
              props.navigation.navigate('Modals', {
                screen: 'NewBill',
                params: { edit: props.route.params.bill }
              } as any)
          },
          {
            label: 'Add Reminder',
            icon: () =>
              <View style={styles.reminderIcon}>
                <Icon icon={Bell} size={16} strokeWidth={2} />
                <Icon icon={Plus} size={10} strokeWidth={3} />
              </View>,
            onSelect: () => { setShowReminderModal(true) }
          },
          {
            label: 'Delete',
            icon: () => <Icon icon={Trash} size={16} strokeWidth={2} color='alert' />,
            onSelect: () => props.navigation.navigate('Modals', {
              screen: 'ConfirmDeleteBill',
              params: { bill: props.route.params.bill }
            })
          }
        ]}
      >
        <Box padding='xxs' borderRadius={'circle'}>
          <Icon icon={MoreHorizontal} size={24} strokeWidth={2} color='secondaryText' />
        </Box>
      </Menu>
    </View>
  )
}
