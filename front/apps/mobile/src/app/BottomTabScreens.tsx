import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Budget, Accounts, Profile } from '@screens';
import { BottomTabNavParamList } from '@types';
import BottomNav from './BottomNav';

const Tab = createBottomTabNavigator<BottomTabNavParamList>();

const BottomTabScreens = () => {

  return (
    <Tab.Navigator
      initialRouteName='Budget'
      backBehavior='history'
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, navigation }) =>
        <BottomNav
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />}>
      <Tab.Screen name="Home" component={Budget} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="Accounts" component={Accounts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

export default BottomTabScreens
