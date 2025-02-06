import { createStackNavigator } from '@react-navigation/stack';

import { ModalStackParamList, RootStackScreenProps } from '@types';
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
  ConfirmDeleteCategory,
  ConfirmDeleteBill,
  BillsCalendar,
} from '@modals';
import { Activity, Transaction } from '@screens';
import {
  useModalStyleInterpolator,
  useModifiedDefaultModalStyleInterpolator,
} from '@/hooks';
import { useAppearance } from '@/features/appearanceSlice';

const Stack = createStackNavigator<ModalStackParamList>();

const ModalScreens = (props: RootStackScreenProps<'Modals'>) => {
  const { mode } = useAppearance();
  const modalStyleInterpolator = useModalStyleInterpolator({ slideOut: false });
  const defaultModalStyleInterpolator =
    useModifiedDefaultModalStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: 'modal' }}
    >
      <Stack.Group
        screenOptions={{
          cardStyleInterpolator: modalStyleInterpolator,
        }}
      >
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen
          name="ConfirmDeletePlaidItem"
          component={ConfirmDeletePlaidItem}
        />
        <Stack.Screen
          name="ConfirmRemoveCoowner"
          component={ConfirmRemoveCoowner}
        />
        <Stack.Screen name="AddCoOwner" component={AddCoOwner} />
        <Stack.Screen
          name="AuthenticatorAppSetup"
          component={AuthenticatorAppSetup}
        />
        <Stack.Screen name="LogoutAllDevices" component={LogoutAllDevices} />
        <Stack.Screen
          name="RemoveAuthenticator"
          component={RemoveAuthenticator}
        />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Split" component={SplitTransaction} />
        <Stack.Screen
          name="ConfirmDeleteCategory"
          component={ConfirmDeleteCategory}
        />
        <Stack.Screen name="ConfirmDeleteBill" component={ConfirmDeleteBill} />
        <Stack.Screen name="BillsCalendar" component={BillsCalendar} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          gestureDirection: 'vertical',
          headerShown: true,
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator,
        }}
      >
        <Stack.Screen name="Transaction" component={Transaction} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator,
        }}
      >
        <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfo} />
        <Stack.Screen name="SplitModal" component={SplitTransaction} />
        <Stack.Screen name="PickerCard" component={CardPicker} />
        <Stack.Screen name="PickAccount" component={AccountsPicker} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default ModalScreens;
