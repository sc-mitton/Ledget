import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { Box, BackHeader } from '@ledget/native-ui';
import { BottomTabScreenProps, BudgetScreenProps, BudgetStackParamList } from '@types';
import { useCardStyleInterpolator } from '@/hooks';
import Menu from './Menu';
import Categories from './categories/Categories';
import Category from './category/Screen';
import Bills from './bills/Bills';
import Carousel from './carousel/Carousel';
import Transaction from '../Transaction/Screen';

const Stack = createStackNavigator<BudgetStackParamList>();

const MainScreen = (props: BudgetScreenProps<'Main'>) => {
  const theme = useTheme()

  return (
    <Box variant='screen'>
      <Carousel />
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.spacing.navHeight * 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Categories {...props} />
        <Bills {...props} />
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
