import { createStackNavigator } from '@react-navigation/stack';

import { ModalStackParamList } from '@types'
import {
  Logout,
  ConfirmDeletePlaidItem,
  EditPersonalInfo,
  ConfirmRemoveCoowner,
  AddCoOwner,
  AuthenticatorAppSetup,
  LogoutAllDevices,
  RemoveAuthenticator,
  ChangePassword
} from '@modals';
import { Activity } from '@screens';

const RootStack = createStackNavigator<ModalStackParamList>();

const ModalScreens = () => {

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Activity" component={Activity} />
      <RootStack.Screen name='Logout' component={Logout} />
      <RootStack.Screen name='ConfirmDeletePlaidItem' component={ConfirmDeletePlaidItem} />
      <RootStack.Screen name='EditPersonalInfo' component={EditPersonalInfo} />
      <RootStack.Screen name='ConfirmRemoveCoowner' component={ConfirmRemoveCoowner} />
      <RootStack.Screen name='AddCoOwner' component={AddCoOwner} />
      <RootStack.Screen name='AuthenticatorAppSetup' component={AuthenticatorAppSetup} />
      <RootStack.Screen name='LogoutAllDevices' component={LogoutAllDevices} />
      <RootStack.Screen name='RemoveAuthenticator' component={RemoveAuthenticator} />
      <RootStack.Screen name='ChangePassword' component={ChangePassword} />
    </RootStack.Navigator>
  )
}

export default ModalScreens
