import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { AccountsScreenProps, AccountsTabsParamList } from '@types';
import { useZoomCardStyleInterpolator } from '@/hooks';
import DepositsPanel from './Deposits/Screen';
import { Box, Header } from '@ledget/native-ui';

const Stack = createStackNavigator<AccountsTabsParamList>()

const AccountTabs = (props: AccountsScreenProps<'AccountsTabs'>) => {
  const cardStyleInterpolator = useZoomCardStyleInterpolator()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator
      }}
      initialRouteName='Deposits'
    >
      <Stack.Screen name='Deposits' component={DepositsPanel} />
    </Stack.Navigator>
  )
}

export default AccountTabs
