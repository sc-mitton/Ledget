import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from '@hooks';
import Welcome from './Welcome';
import Tour from './Tour';

const Stack = createStackNavigator<OnboardingStackParamList>();

const Onboarding = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator screenOptions={{ header: BackHeader, cardStyleInterpolator }}>
      <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
      <Stack.Screen name="Tour" options={{ title: 'Tour' }} component={Tour} />
    </Stack.Navigator>
  )
}

export default Onboarding;
