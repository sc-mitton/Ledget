import { MoreHorizontal, Maximize2, Edit2, DollarSign } from "geist-native-icons";
import { View } from "react-native";

import { Menu, Box, Icon } from "@ledget/native-ui";
import { RootStackScreenProps } from "@types";
import { Transaction, useUpdateTransactionMutation } from "@ledget/shared-features";
import { useEffect } from "react";

const BakedMenu = (props: RootStackScreenProps<'Transaction'> & { transaction: Transaction }) => {
  const [updateTransaction, { data: updatedTransaction }] = useUpdateTransactionMutation();

  useEffect(() => {
    if (updatedTransaction) {
      props.navigation.setParams({ transaction: updatedTransaction })
    }
  }, [updatedTransaction])

  return (
    <Menu
      as='menu'
      placement="right"
      closeOnSelect={true}
      items={[
        {
          label: 'Rename',
          icon: () => <Icon icon={Edit2} size={16} strokeWidth={2} />,
          onSelect: () => props.navigation.setParams({ options: { rename: true } })
        },
        {
          label: 'Split',
          icon: () =>
            <View style={{ transform: [{ rotate: '45deg' }] }}>
              <Icon icon={Maximize2} size={16} strokeWidth={2} />
            </View>,
          onSelect: () => props.navigation.navigate(
            'Modals',
            { screen: "Split", params: { transaction: props.transaction } })
        },
        {
          label: props.transaction.detail !== 'spending' ? 'Mark not spending' : 'Mark as spending',
          newSection: true,
          icon: () => <Icon icon={DollarSign} size={16} strokeWidth={2} />,
          onSelect: () => updateTransaction({
            transactionId: props.transaction.transaction_id,
            data: props.transaction.detail !== 'spending' ? { detail: 'spending' } : { detail: null }
          })
        }
      ]}
    >
      <Box padding='xxs'>
        <Icon icon={MoreHorizontal} size={24} strokeWidth={2} color='secondaryText' />
      </Box>
    </Menu>
  )
}

export default BakedMenu;
