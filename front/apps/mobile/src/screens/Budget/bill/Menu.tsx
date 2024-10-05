import { View } from 'react-native';
import { Edit2, MoreHorizontal, Trash } from 'geist-native-icons';

import styles from './styles/menu';
import { Menu, Box, Icon } from '@ledget/native-ui';
import { BudgetScreenProps } from '@types';

export default function BakedMenu(props: BudgetScreenProps<'Category'>) {
  return (
    <View style={styles.menu}>
      <Menu
        as='menu'
        placement='right'
        items={[
          {
            label: 'Edit',
            icon: () => <Icon icon={Edit2} size={16} strokeWidth={2} />,
            onSelect: () =>
              props.navigation.navigate('Modals', {
                screen: 'NewCategory',
                params: { edit: props.route.params.category }
              })
          },
          {
            label: 'Delete',
            icon: () => <Icon icon={Trash} size={16} strokeWidth={2} color='alert' />,
            onSelect: () => props.navigation.navigate('Modals', {
              screen: 'ConfirmDeleteCategory',
              params: { category: props.route.params.category }
            })
          }
        ]}
      >
        <Box padding='xxs' borderRadius={'circle'}>
          <Icon icon={MoreHorizontal} size={28} strokeWidth={2} color='secondaryText' />
        </Box>
      </Menu>
    </View>
  )
}
