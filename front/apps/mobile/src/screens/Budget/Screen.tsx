import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Menu from './Menu';
import styles from './styles/screen';
import { Box } from '@ledget/native-ui';
import { BottomTabScreenProps, BudgetScreenProps, BudgetStackParamList } from '@types';
import Categories from './categories/Categories';
import Bills from './bills/Bills';
import Carousel from './carousel/Carousel';

const Stack = createStackNavigator<BudgetStackParamList>();

const MainScreen = (props: BudgetScreenProps<'Main'>) => {
  const theme = useTheme()

  return (
    <Box variant='screen' paddingTop='none'>
      <Carousel />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollView,
          { marginBottom: theme.spacing.navHeight * 1.25 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Categories />
        <Bills />
      </ScrollView>
    </Box>
  )
}

const Screen = (props: BottomTabScreenProps<'Budget'>) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => <></>,
        headerTitle: () => '',
        headerRight: () => <Menu />
      }}
    >
      <Stack.Screen name='Main' component={MainScreen} />
    </Stack.Navigator>
  )
}

export default Screen
