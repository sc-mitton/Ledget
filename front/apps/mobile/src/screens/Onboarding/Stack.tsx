import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingStackParamList } from '@types';
import { useCardStyleInterpolator } from '@hooks';
import Welcome from './Welcome';
import TourSpending from './TourSpending';
import TourBills from './TourBills';
import TourActivity from './TourActivity'
import TourAccounts from './TourAccounts';
import AddCategories from './AddCategories';
import AddBills from './AddBills';
import Header from './Header';
import Progress from './Progress';

const Stack = createStackNavigator<OnboardingStackParamList>();

const Onboarding = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Progress>
      <Stack.Navigator screenOptions={{ header: Header, cardStyleInterpolator }}>
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
        <Stack.Screen name="TourSpending" component={TourSpending} />
        <Stack.Screen name="TourBills" component={TourBills} />
        <Stack.Screen name='TourActivity' component={TourActivity} />
        <Stack.Screen name="TourAccounts" component={TourAccounts} />
        <Stack.Screen name="AddCategories" component={AddCategories} />
        <Stack.Screen name="AddBills" component={AddBills} />
      </Stack.Navigator>
    </Progress>
  )
}

export default Onboarding;
