import { Plus, Info, ArrowLeft, ArrowRight } from 'geist-native-icons';

import styles from './styles/transaction-menu';
import { Icon, Menu } from '@ledget/native-ui';
import type { MenuProps } from '@ledget/native-ui';
import { ModalScreenProps } from '@types';
import { View } from 'react-native';
import { Transaction } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';
import { useNavigation } from '@react-navigation/native';

interface Props extends Omit<MenuProps, 'items'> {
  transaction: Transaction;
}

const TransactionMenu = (props: Props) => {
  const {
    transaction,
    children,
    ...rest
  } = props;

  const { mode } = useAppearance();
  const { navigation } = useNavigation<ModalScreenProps<'Activity'>>();

  return (
    <Menu
      as='context-menu'
      hasShadow={mode === 'light'}
      onShowChange={props.onShowChange}
      items={[
        {
          label: 'Details',
          icon: () => <Icon icon={Info} size={16} strokeWidth={2} />,
          onSelect: () => navigation.navigate(
            'BottomTabs',
            {
              screen: 'Accounts',
              params: {
                screen: 'Transaction',
                params: { transaction }
              }
            }
          )
        },
        {
          label: 'Split',
          icon: () =>
            <View style={styles.splitIcon}>
              <Icon icon={ArrowLeft} size={12} strokeWidth={2.5} />
              <Icon icon={ArrowRight} size={12} strokeWidth={2.5} />
            </View>,
          onSelect: () => navigation.navigate(
            'Modals',
            { screen: 'Split', params: { transaction } }
          )
        },
        {
          label: 'New Monthly Bill',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () => navigation.navigate(
            'Modals',
            { screen: 'NewBill', params: { transaction, period: 'month' } }
          )
        },
        {
          label: 'New Yearly Bill',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () => navigation.navigate(
            'Modals',
            { screen: 'NewBill', params: { transaction, period: 'year' } }
          )
        },
      ]}
      {...rest}
    >
      {children}
    </Menu>
  );
}

export default TransactionMenu;
