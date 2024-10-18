import { createStackNavigator } from '@react-navigation/stack';

import { BackHeader } from '@ledget/native-ui';
import { BottomTabScreenProps, BudgetStackParamList } from '@types';
import { useAppSelector, useCardStyleInterpolator } from '@/hooks';
import Menus from './Menus';
import Category from './category/Screen';
import Bill from './bill/Screen';
import Transaction from '../Transaction/Screen';
import EditCategories from './edit-categories/EditCategories';
import EditBills from './edit-bills/EditBills';
import DatePicker from './month-picker/MonthPicker';
import { selectBudgetMonthYear } from '@ledget/shared-features';
import dayjs from 'dayjs';
import Budget from './Budget';

const Stack = createStackNavigator<BudgetStackParamList>();

const Screen = (props: BottomTabScreenProps<'Budget'>) => {
  const cardStyleInterpolator = useCardStyleInterpolator()
  const { month, year } = useAppSelector(selectBudgetMonthYear)

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitle: () => '',
        headerRight: () => <Menus navigation={props.navigation} />,
        headerLeft: () => <DatePicker />,
        cardStyleInterpolator
      }}
    >
      <Stack.Screen name='Main' component={Budget} />
      <Stack.Screen
        options={{
          title: 'Spending Categories',
          header: (props) =>
            <BackHeader pagesWithTitle={['EditCategories']} {...props} />,
          headerRight: () => null
        }}
        name='EditCategories'
        component={EditCategories}
      />
      <Stack.Screen
        options={{
          title: 'Bills',
          header: (props) =>
            <BackHeader pagesWithTitle={['EditBills']} {...props} />,
          headerRight: () => null
        }}
        name='EditBills'
        component={EditBills}
      />
      <Stack.Screen
        options={{
          title: dayjs(`${year}-${month}-01`).format('MMM YYYY'),
          header: (props) => <BackHeader pagesWithTitle={['Category']} {...props} />,
          headerRight: () => null
        }}
        name='Category' component={Category} />
      <Stack.Screen
        options={{
          header: (props) => <BackHeader {...props} />,
          headerRight: () => null
        }}
        name='Bill' component={Bill} />
      <Stack.Screen
        options={{ header: (props) => <BackHeader {...props} />, headerRight: () => null }}
        name='Transaction' component={Transaction} />
    </Stack.Navigator>
  )
}

export default Screen
