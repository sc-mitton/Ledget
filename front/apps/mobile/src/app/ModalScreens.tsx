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
  ChangePassword,
  SplitTransaction,
  CardPicker,
  AccountsPicker,
  NewCategory,
  NewBill,
  EmojiPicker
} from '@modals';
import { Activity } from '@screens';
import { useModalStyleInterpolator, useModifiedDefaultModalStyleInterpolator, useFullScreenModalStyleInterpolator } from '@/hooks';

const RootStack = createStackNavigator<ModalStackParamList>();

const ModalScreens = () => {
  const modalStyleInterpolator = useModalStyleInterpolator({ slideOut: false });
  const defaultModalStyleInterpolator = useModifiedDefaultModalStyleInterpolator()
  const fullScreenModalStyleInterpolator = useFullScreenModalStyleInterpolator()

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Activity" component={Activity} options={{ cardStyleInterpolator: modalStyleInterpolator }} />
      <RootStack.Screen name='Logout' component={Logout} />
      <RootStack.Screen name='ConfirmDeletePlaidItem' component={ConfirmDeletePlaidItem} />
      <RootStack.Screen name='EditPersonalInfo' component={EditPersonalInfo} />
      <RootStack.Screen name='ConfirmRemoveCoowner' component={ConfirmRemoveCoowner} />
      <RootStack.Screen name='AddCoOwner' component={AddCoOwner} />
      <RootStack.Screen name='AuthenticatorAppSetup' component={AuthenticatorAppSetup} />
      <RootStack.Screen name='LogoutAllDevices' component={LogoutAllDevices} />
      <RootStack.Screen name='RemoveAuthenticator' component={RemoveAuthenticator} />
      <RootStack.Screen name='ChangePassword' component={ChangePassword} />
      <RootStack.Screen name='Split' component={SplitTransaction} />
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator
        }}>
        <RootStack.Screen name='NewCategory' component={NewCategory} />
        <RootStack.Screen name='NewBill' component={NewBill} />
        <RootStack.Screen name='PickerCard' component={CardPicker} />
        <RootStack.Screen name='PickAccount' component={AccountsPicker} />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default ModalScreens
