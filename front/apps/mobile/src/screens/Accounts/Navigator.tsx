import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { BackHeader } from '@ledget/native-ui';
import { AccountsStackParamList } from '@types';
import { useCardStyleInterpolator, useModifiedDefaultModalStyleInterpolator } from '@/hooks';
import { Transaction } from '@screens';
import AccountTabs from './AccountTabs';

const Stack = createStackNavigator<AccountsStackParamList>()

const Screen = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()
  const modalStyleInterpolator = useModifiedDefaultModalStyleInterpolator()

  return (
    <Stack.Navigator id='accounts' initialRouteName='Main'>
      <Stack.Group
        screenOptions={{
          header: (props) => <BackHeader {...props} pagesWithTitle={['Split']} />,
          cardStyleInterpolator
        }}
      >
        <Stack.Screen options={{ headerShown: false }} name='Main' component={AccountTabs} />
        <Stack.Screen name='Transaction' component={Transaction} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Screen
