import { Plus, Info, ArrowLeft, ArrowRight } from 'geist-native-icons';

import styles from './styles/menu';
import { Icon, ContextMenu } from '@ledget/native-ui';
import type { ContextMenuProps } from '@ledget/native-ui';
import { ModalScreenProps } from '@types';
import { View } from 'react-native';

interface Props extends Omit<ContextMenuProps, 'items'>, ModalScreenProps<'Activity'> {
  transaction: string;
}

const TransactionMenu = (props: Props) => {
  const {
    transaction,
    children,
    ...rest
  } = props;

  return (
    <ContextMenu
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
          onSelect: () => props.navigation.navigate('SplitTransaction', { transaction })
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
    </ContextMenu>
  );
}

export default TransactionMenu;
