import { View } from 'react-native';
import { MoreHorizontal, Plus } from 'geist-native-icons';

import styles from './styles/menu';
import { Menu, Box, Icon } from '@ledget/native-ui';
import { AccountsScreenProps } from '@types';

export default function BakedMenu(props: AccountsScreenProps<'AccountsTabs'>) {
  return (
    <View style={styles.menu}>
      <Menu
        as='menu'
        placement='right'
        items={[
          {
            label: 'Connect account',
            icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
            onSelect: () => props.navigation.navigate('Profile', { screen: 'Connections', params: { screen: 'All' } })
          }
        ]}
      >
        <Box padding='xxs' backgroundColor='alert' borderRadius={30}>
          <Icon icon={MoreHorizontal} size={24} strokeWidth={2} color='secondaryText' />
        </Box>
      </Menu>
    </View>
  )
}
