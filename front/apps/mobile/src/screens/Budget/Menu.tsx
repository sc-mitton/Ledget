import { MoreHorizontal, Maximize2, Plus } from "geist-native-icons";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles/menu";
import { Menu, Box, Icon } from "@ledget/native-ui";
import { BottomTabScreenProps } from "@types";

const TopRightMenu = () => {
  const { navigation } = useNavigation<BottomTabScreenProps<any>>();

  return (
    <View style={styles.menu}>
      <Menu
        as='menu'
        placement="right"
        closeOnSelect={true}
        items={[
          {
            label: 'Add Bill',
            icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
            onSelect: () => navigation.navigate(
              'Modals',
              { screen: "NewBill" }
            )
          },
          {
            label: 'Add Category',
            icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
            onSelect: () => navigation.navigate(
              'Modals',
              { screen: "NewCategory" })
          },
        ]}
      >
        <Box padding='xxs'>
          <Icon icon={MoreHorizontal} size={28} strokeWidth={2} color='secondaryText' />
        </Box>
      </Menu>
    </View>
  )
}

export default TopRightMenu;
