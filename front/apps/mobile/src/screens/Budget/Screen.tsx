import { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles/screen';
import { Box, BackHeader } from '@ledget/native-ui';
import { BottomTabScreenProps, BudgetScreenProps, BudgetStackParamList } from '@types';
import { useCardStyleInterpolator } from '@/hooks';
import Menu from './Menu';
import Categories from './categories/Categories';
import CategoriesHeader from './categories/Header';
import Category from './category/Screen';
import Bills from './bills/Bills';
import BillsHeader from './bills/Header';
import Carousel from './carousel/Carousel';
import Transaction from '../Transaction/Screen';

const Stack = createStackNavigator<BudgetStackParamList>();

const MainScreen = (props: BudgetScreenProps<'Main'>) => {
  const theme = useTheme()
  const [categoriesIndex, setCategoriesIndex] = useState(0)
  const [billsIndex, setBillsIndex] = useState(0)

  return (
    <Box variant='screen'>
      <Carousel />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[{ paddingBottom: theme.spacing.navHeight * 1 }, styles.scrollViewContent]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0, 2, 3]}
      >
        <CategoriesHeader index={categoriesIndex} />
        <Categories {...props} setIndex={setCategoriesIndex} />
        <View style={styles.scrollViewSpacer} />
        <BillsHeader index={billsIndex} />
        <Bills {...props} setIndex={setBillsIndex} />
      </ScrollView>
    </Box>
  )
}

const Screen = (props: BottomTabScreenProps<'Budget'>) => {
  const cardStyleInterpolator = useCardStyleInterpolator()

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitle: () => '',
        headerRight: () => <Menu navigation={props.navigation} />,
        cardStyleInterpolator
      }}
    >
      <Stack.Screen name='Main' component={MainScreen} />
      <Stack.Screen
        options={{ header: (props) => <BackHeader {...props} />, headerRight: () => null }}
        name='Category' component={Category} />
      <Stack.Screen
        options={{ header: (props) => <BackHeader {...props} />, headerRight: () => null }}
        name='Transaction' component={Transaction} />
    </Stack.Navigator>
  )
}

export default Screen
