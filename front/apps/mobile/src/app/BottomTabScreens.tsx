import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import styles from './styles/bottom-tab-screens';
import BottomNav from './BottomNav';
import { Budget, Accounts, Profile } from '@screens';
import { BottomTabNavParamList } from '@types';

const Tab = createBottomTabNavigator<BottomTabNavParamList>();

const BottomTabScreens = () => {

  return (
    <View style={styles.container}>
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
    </View>
  )
}

export default BottomTabScreens
