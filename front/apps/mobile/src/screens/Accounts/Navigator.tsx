import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BackHeader } from '@ledget/native-ui';
import { AccountsStackParamList } from '@types';
import { useCardStyleInterpolator, useModifiedDefaultModalStyleInterpolator } from '@/hooks';
import { AccountsPicker } from '@/modals';
import AccountTabs from './AccountScreens';
import Transaction from '../Transaction/Screen';

const Stack = createStackNavigator<AccountsStackParamList>()

const Screen = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()
  const modalStyleInterpolator = useModifiedDefaultModalStyleInterpolator()

  return (
    <Stack.Navigator id='accounts' initialRouteName='AccountsTabs'>
      <Stack.Group
        screenOptions={{
          header: (props) => <BackHeader {...props} pagesWithTitle={['Split']} />,
          cardStyleInterpolator
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name='AccountsTabs'
          component={AccountTabs}
        />
        <Stack.Screen name='Transaction' component={Transaction} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          gestureResponseDistance: 30,
          cardStyleInterpolator: modalStyleInterpolator
        }}>
        <Stack.Screen name='PickAccount' component={AccountsPicker} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Screen
