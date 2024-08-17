import { createStackNavigator } from '@react-navigation/stack';

import { ModalStackParamList } from '@types'
import { Activity } from '@screens';

const RootStack = createStackNavigator<ModalStackParamList>();

const ModalScreens = () => {

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Activity" component={Activity} />
    </RootStack.Navigator>
  )
}

export default ModalScreens
