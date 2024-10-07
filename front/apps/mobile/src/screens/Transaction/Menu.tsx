import { MoreHorizontal, Maximize2, Edit2 } from "geist-native-icons";
import { View } from "react-native";

import { Menu, Box, Icon } from "@ledget/native-ui";
import { RootStackScreenProps } from "@types";
import { Transaction } from "@ledget/shared-features";

const BakedMenu = (props: RootStackScreenProps<'Transaction'> & { transaction: Transaction }) => {

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
      ]}
    >
      <Box padding='xxs'>
        <Icon icon={MoreHorizontal} size={24} strokeWidth={2} color='secondaryText' />
      </Box>
    </Menu>
  )
}

export default BakedMenu;
