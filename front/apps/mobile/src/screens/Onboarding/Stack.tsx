import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingStackParamList } from '@types';
import { useCardStyleInterpolator } from '@hooks';
import Welcome from './Welcome';
import AddCategories from './AddCategories';
import AddBills from './AddBills';
import Progress from './Header';
import Connect from './Connect';

const Stack = createStackNavigator<OnboardingStackParamList>();

const Onboarding = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Progress>
      <Stack.Navigator
        screenOptions={{ headerShown: false, cardStyleInterpolator }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Connect" component={Connect} />
        <Stack.Screen name="AddCategories" component={AddCategories} />
        <Stack.Screen name="AddBills" component={AddBills} />
      </Stack.Navigator>
    </Progress>
  );
};

export default Onboarding;
