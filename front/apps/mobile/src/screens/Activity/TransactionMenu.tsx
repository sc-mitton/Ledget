import { Plus, Info, ArrowLeft, ArrowRight } from 'geist-native-icons';

import styles from './styles/transaction-menu';
import { Icon, Menu } from '@ledget/native-ui';
import type { MenuProps } from '@ledget/native-ui';
import { ModalScreenProps } from '@types';
import { View } from 'react-native';
import { Transaction } from '@ledget/shared-features';

interface Props extends Omit<MenuProps, 'items'>, ModalScreenProps<'Activity'> {
  transaction: Transaction;
}

const TransactionMenu = (props: Props) => {
  const {
    transaction,
    children,
    ...rest
  } = props;

  return (
    <Menu
      onShowChange={props.onShowChange}
      items={[
        {
          label: 'Details',
          icon: () => <Icon icon={Info} size={16} strokeWidth={2} />,
          onSelect: () => props.navigation.navigate('TransactionDetails', { transaction })
        },
        {
          label: 'Split',
          icon: () =>
            <View style={styles.splitIcon}>
              <Icon icon={ArrowLeft} size={12} strokeWidth={2.5} />
              <Icon icon={ArrowRight} size={12} strokeWidth={2.5} />
            </View>,
          onSelect: () => props.navigation.navigate('Split', { transaction })
        },
        {
          label: 'New Monthly Bill',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () => props.navigation.navigate('NewBill', { transaction, period: 'monthly' })
        },
        {
          label: 'New Yearly Bill',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () => props.navigation.navigate('NewBill', { transaction, period: 'yearly' })
        },
      ]}
      {...rest}
    >
      {children}
    </Menu>
  );
}

export default TransactionMenu;
