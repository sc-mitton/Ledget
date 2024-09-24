import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BackHeader } from '@ledget/native-ui';
import { AccountsStackParamList } from '@types';
import { useCardStyleInterpolator } from '@/hooks';
import AccountTabs from './AccountScreens';
import Transaction from '../Transaction/Screen';

const Stack = createStackNavigator<AccountsStackParamList>()

const Screen = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()

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
    </Stack.Navigator>
  )
}

export default Screen
