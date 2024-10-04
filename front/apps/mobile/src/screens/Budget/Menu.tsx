import { Plus } from "geist-native-icons";
import { View } from "react-native";

import styles from "./styles/menu";
import { Menu, Box, Icon } from "@ledget/native-ui";
import { BottomTabScreenProps } from "@types";

const TopRightMenu = ({ navigation }: { navigation: BottomTabScreenProps<any>['navigation'] }) => {

  return (
    <View style={styles.menu}>
      <Menu
        as='menu'
        placement="right"
        closeOnSelect={true}
        items={[
          {
            label: 'New Bill',
            icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
            onSelect: () => navigation.navigate(
              'Modals',
              { screen: "NewBill" }
            )
          },
          {
            label: 'New Category',
            icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
            onSelect: () => navigation.navigate(
              'Modals',
              { screen: "NewCategory" })
          },
        ]}
      >
        <Box padding='xs' backgroundColor="grayButton" borderRadius="xs">
          <Icon icon={Plus} size={20} strokeWidth={2} color='blueText' />
        </Box>
      </Menu>
    </View>
  )
}

export default TopRightMenu;
