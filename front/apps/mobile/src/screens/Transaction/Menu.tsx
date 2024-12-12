import { MoreHorizontal, Maximize2, Edit2 } from "geist-native-icons";
import { View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme } from "@shopify/restyle";

import { Menu, Box, Icon } from "@ledget/native-ui";
import { RootStackScreenProps } from "@types";
import { Transaction, useUpdateTransactionMutation } from "@ledget/shared-features";
import { useEffect } from "react";

const BakedMenu = (props: RootStackScreenProps<'Transaction'> & { transaction: Transaction }) => {
  const [updateTransaction, { data: updatedTransaction }] = useUpdateTransactionMutation();
  const theme = useTheme()

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
          icon: () =>
            <Box marginRight='xxs'>
              <FontAwesome6 name="dollar" size={15} color={theme.colors.mainText} />
            </Box>,
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
