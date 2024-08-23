import { ReactElement } from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { Plus, ArrowLeft, ArrowRight, Info } from 'geist-native-icons';

import { ModalScreenProps } from '@types'
import { Icon } from '@ledget/native-ui';
import { View } from 'react-native';

interface Props extends ModalScreenProps<'Activity'> {
  transaction: string,
  children: ReactElement<any>
};

const TransactionMenu = (props: Props) => {
  const { transaction, children } = props;

  const items = [
    {
      text: 'Details',
      icon: () => <Icon icon={Info} />,
      onPress: () => props.navigation.navigate('TransactionDetails', { transaction })
    },
    {
      text: 'Split',
      icon: () => (<View style={{ flexDirection: 'row', gap: 4 }}><Icon icon={ArrowLeft} /><Icon icon={ArrowRight} /></View>),
      onPress: () => props.navigation.navigate('SplitTransaction', { transaction })
    },
    {
      text: 'New Monthly Bill',
      icon: () => <Icon icon={Plus} />,
      onPress: () => props.navigation.navigate('NewBill', { transaction, period: 'monthly' })
    },
    {
      text: 'New Yearly Bill',
      icon: () => <Icon icon={Plus} />,
      onPress: () => props.navigation.navigate('NewBill', { transaction, period: 'yearly' })
    }
  ]

  return (
    <HoldItem items={items}>
      {children}
    </HoldItem>
  )
}

export default TransactionMenu
