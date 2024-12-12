import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomNav from './BottomNav';
import { Budget, Accounts, Profile, Home } from '@screens';
import { BottomTabNavParamList, RootStackScreenProps } from '@types';
import { selectLastTab, selectSettings } from '@/features/uiSlice';
import { useAppSelector } from '@/hooks';

const Tab = createBottomTabNavigator<BottomTabNavParamList>();

// Transition spec coming soon, update it when that comes out for bottom tabs

const BottomTabScreens = (props: RootStackScreenProps<'BottomTabs'>) => {
  const lastTab = useAppSelector(selectLastTab);
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    props.navigation.preload(
      'Modals',
      { screen: 'Activity', params: { tab: 0 } }
    )
  }, [])

  return (
    <Tab.Navigator
      initialRouteName={
        settings.startOnHome
          ? 'Home'
          : (['Home', 'Budget', 'Accounts', 'Profile'] as const)[lastTab]
      }
      backBehavior='history'
      screenOptions={{ headerShown: false, animation: 'fade' }}
      tabBar={({ state, descriptors, navigation }: any) =>
        <BottomNav
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />}>

      <Tab.Screen
        name="Home"
        component={Home}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
      />
      <Tab.Screen
        name="Accounts"
        component={Accounts}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  )
}

export default BottomTabScreens
