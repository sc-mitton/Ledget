import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import styles from './styles/bottom-tab-screens';
import BottomNav from './BottomNav';
import { Budget, Accounts, Profile } from '@screens';
import { BottomTabNavParamList } from '@types';

const Tab = createBottomTabNavigator<BottomTabNavParamList>();

const BottomTabScreens = () => {

  return (
    <Tab.Navigator
      initialRouteName='Budget'
      backBehavior='history'
      sceneContainerStyle={styles.sceneContainer}
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
