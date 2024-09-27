import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Menu from './Menu';
import { Box } from '@ledget/native-ui';
import { BottomTabScreenProps, BudgetScreenProps, BudgetStackParamList } from '@types';
import Categories from './categories/Categories';
import Bills from './bills/Bills';
import Carousel from './carousel/Carousel';

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
        <Categories />
        <Bills {...props} />
      </ScrollView>
    </Box>
  )
}

const Screen = (props: BottomTabScreenProps<'Budget'>) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitle: () => '',
        headerRight: () => <Menu />
      }}
    >
      <Stack.Screen name='Main' component={MainScreen} />
    </Stack.Navigator>
  )
}

export default Screen
