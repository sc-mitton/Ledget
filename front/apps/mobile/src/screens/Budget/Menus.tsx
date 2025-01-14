import { View } from 'react-native';
import {
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Plus,
  AlignJustify,
} from 'geist-native-icons';

import { Filter2 } from '@ledget/media/native';
import styles from './styles/menu';
import { Menu, Box, Icon, Text } from '@ledget/native-ui';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
  setBillCatOrder,
  OrderOptions,
  OrderOptionT,
  selectBillCatOrder,
} from '@ledget/shared-features';
import { BottomTabScreenProps } from '@types';
import { camelToSpaceWithCaps } from '@ledget/helpers';

const EllipseMenu = ({
  navigation,
}: {
  navigation: BottomTabScreenProps<any>['navigation'];
}) => {
  return (
    <Menu
      as="menu"
      placement="right"
      closeOnSelect={true}
      items={[
        {
          label: 'New Bill',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () =>
            navigation.navigate('PageSheetModals', {
              screen: 'NewBill',
              params: { options: { title: 'New Bill' } },
            }),
        },
        {
          label: 'New Category',
          icon: () => <Icon icon={Plus} size={16} strokeWidth={2} />,
          onSelect: () =>
            navigation.navigate('PageSheetModals', {
              screen: 'NewCategory',
              params: { options: { title: 'New Category' } },
            }),
        },
        {
          label: 'View All Categories',
          icon: () => <Icon icon={AlignJustify} size={16} strokeWidth={2} />,
          newSection: true,
          onSelect: () =>
            navigation.navigate('Budget', { screen: 'EditCategories' }),
        },
        {
          label: 'View All Bills',
          icon: () => <Icon icon={AlignJustify} size={16} strokeWidth={2} />,
          onSelect: () =>
            navigation.navigate('Budget', { screen: 'EditBills' }),
        },
      ]}
    >
      <Box
        padding="xs"
        borderColor="lightGrayButton"
        borderWidth={1.5}
        borderRadius="xs"
      >
        <Icon
          icon={MoreHorizontal}
          size={20}
          strokeWidth={2}
          color="secondaryText"
        />
      </Box>
    </Menu>
  );
};

const OptionIcon = ({
  str,
  current,
}: {
  str: OrderOptionT;
  current?: OrderOptionT;
}) => {
  const a = str.toLowerCase().includes('name') ? 'a-z' : '$';
  const icon = str.toLowerCase().includes('asc') ? ArrowUp : ArrowDown;

  return (
    <View style={[current ? styles.iconWrapper : styles.buttonIconWrapper]}>
      <Text color={str === current ? 'blueText' : 'mainText'}>{a}</Text>
      <Icon
        icon={icon}
        size={14}
        strokeWidth={2}
        color={str === current ? 'blueText' : 'mainText'}
      />
    </View>
  );
};

const FilterMenu = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectBillCatOrder);

  return (
    <Menu
      as="menu"
      placement="right"
      closeOnSelect={true}
      items={OrderOptions.filter((o) => o !== 'default').map((o) => ({
        label: camelToSpaceWithCaps(o),
        icon: () => <OptionIcon str={o} current={order} />,
        isSelected: o === order,
        onSelect: () => dispatch(setBillCatOrder(order === o ? 'default' : o)),
      }))}
    >
      <Box
        paddingHorizontal="xs"
        paddingVertical={order !== 'default' ? 'xxs' : 'xs'}
        borderColor="lightGrayButton"
        borderWidth={1.5}
        borderRadius="s"
      >
        {order !== 'default' ? (
          <OptionIcon str={order} />
        ) : (
          <Icon
            icon={Filter2}
            size={20}
            strokeWidth={2}
            color="secondaryText"
          />
        )}
      </Box>
    </Menu>
  );
};

const Menus = ({
  navigation,
}: {
  navigation: BottomTabScreenProps<any>['navigation'];
}) => {
  return (
    <View style={styles.menu}>
      <FilterMenu />
      <EllipseMenu navigation={navigation} />
    </View>
  );
};

export default Menus;
