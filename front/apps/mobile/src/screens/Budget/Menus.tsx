import { View } from "react-native";
import { ArrowUp, ArrowDown, MoreHorizontal, Plus, AlignJustify } from "geist-native-icons";

import { Filter2 } from "@ledget/media/native";
import styles from "./styles/menu";
import { Menu, Box, Icon, Text } from "@ledget/native-ui";
import { useAppDispatch } from "@hooks";
import { setBillCatSort } from "@features/uiSlice";
import { BottomTabScreenProps } from "@types";

const EllipseMenu = ({ navigation }: { navigation: BottomTabScreenProps<any>['navigation'] }) => {
  return (
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
        {
          label: 'View All Categories',
          icon: () => <Icon icon={AlignJustify} size={16} strokeWidth={2} />,
          newSection: true,
          onSelect: () => navigation.navigate(
            'Budget',
            { screen: 'EditCategories' }
          )
        },
        {
          label: 'View All Bills',
          icon: () => <Icon icon={AlignJustify} size={16} strokeWidth={2} />,
          onSelect: () => navigation.navigate(
            'Budget',
            { screen: 'EditBills' }
          )
        }
      ]}
    >
      <Box padding='xs' backgroundColor="grayButton" borderRadius="xs">
        <Icon icon={MoreHorizontal} size={22} strokeWidth={2} color='secondaryText' />
      </Box>
    </Menu>
  )
}

const FilterMenu = () => {
  const dispatch = useAppDispatch();
  return (
    <Menu
      as='menu'
      placement="right"
      closeOnSelect={true}
      items={[
        {
          label: 'Name Asc',
          icon: () =>
            <View style={styles.iconWrapper}>
              <Text>a-z</Text>
              <Icon icon={ArrowUp} size={16} strokeWidth={2} />
            </View>,
          onSelect: () => dispatch(setBillCatSort('nameAsc'))
        },
        {
          label: 'Name Desc',
          icon: () =>
            <View style={styles.iconWrapper}>
              <Text>a-z</Text>
              <Icon icon={ArrowDown} size={16} strokeWidth={2} />
            </View>,
          onSelect: () => dispatch(setBillCatSort('nameDesc'))
        },
        {
          label: 'Amount Asc',
          icon: () =>
            <View style={styles.iconWrapper}>
              <Text>$</Text>
              <Icon icon={ArrowUp} size={16} strokeWidth={2} />
            </View>,
          onSelect: () => dispatch(setBillCatSort('amountAsc'))
        },
        {
          label: 'Amount Desc',
          icon: () =>
            <View style={styles.iconWrapper}>
              <Text>$</Text>
              <Icon icon={ArrowDown} size={16} strokeWidth={2} />
            </View>,
          onSelect: () => dispatch(setBillCatSort('amountDesc'))
        }
      ]}
    >
      <Box padding='xs' backgroundColor="grayButton" borderRadius="xs">
        <Icon icon={Filter2} size={22} strokeWidth={2} color='secondaryText' />
      </Box>
    </Menu>
  )
}

const Menus = ({ navigation }: { navigation: BottomTabScreenProps<any>['navigation'] }) => {

  return (
    <View style={styles.menu}>
      <FilterMenu />
      <EllipseMenu navigation={navigation} />
    </View>
  )
}

export default Menus;
