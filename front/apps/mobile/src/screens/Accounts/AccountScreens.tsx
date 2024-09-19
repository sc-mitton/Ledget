import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { AccountsScreenProps, AccountsTabsParamList } from '@types';
import { useZoomCardStyleInterpolator } from '@/hooks';
import DepositsPanel from './Deposits/Screen';
import { DefaultHeader } from './Header';

const Stack = createStackNavigator<AccountsTabsParamList>()

const AccountTabs = (props: AccountsScreenProps<'AccountsTabs'>) => {
  const cardStyleInterpolator = useZoomCardStyleInterpolator()
  const theme = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerBackground: () => <View />,
          header: () => <DefaultHeader {...props} />,
          cardStyleInterpolator
        }}
        initialRouteName='Deposits'
      >
        <Stack.Screen name='Deposits' component={DepositsPanel} />
      </Stack.Navigator>
    </View >
  )
}

export default AccountTabs
