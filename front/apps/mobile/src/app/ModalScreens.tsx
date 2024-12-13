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
  ConfirmDeleteCategory,
  ConfirmDeleteBill,
  Holdings,
  BillsCalendar
} from '@modals';
import { Activity, Transaction } from '@screens';
import { Box, Button, Text } from '@ledget/native-ui';
import {
  useModalStyleInterpolator,
  useModifiedDefaultModalStyleInterpolator
} from '@/hooks';

const RootStack = createStackNavigator<ModalStackParamList>();

const ModalScreens = () => {
  const modalStyleInterpolator = useModalStyleInterpolator({ slideOut: false });
  const defaultModalStyleInterpolator = useModifiedDefaultModalStyleInterpolator()

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen
        name="Activity"
        component={Activity}
        options={{
          cardStyleInterpolator: modalStyleInterpolator
        }}
      />
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
      <RootStack.Screen name='ConfirmDeleteCategory' component={ConfirmDeleteCategory} />
      <RootStack.Screen name='ConfirmDeleteBill' component={ConfirmDeleteBill} />
      <RootStack.Screen name='BillsCalendar' component={BillsCalendar} />
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          gestureDirection: 'vertical',
          headerShown: true,
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator
        }}>
        <RootStack.Screen name='Transaction' component={Transaction} />
      </RootStack.Group>
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          gestureDirection: 'vertical',
          headerShown: true,
          header: (props) => (
            <Box
              flexDirection='row'
              borderTopEndRadius='xl'
              borderTopStartRadius='xl'
              backgroundColor='modalBox'
              paddingHorizontal='m'
              paddingTop='l'
              paddingBottom='s'
              justifyContent='space-between'
              alignItems='center'
              borderBottomColor='modalSeperator'
              borderBottomWidth={2}
            >
              <Button
                label='Cancel'
                textColor='blueText'
                variant='bold'
                onPress={() => props.navigation.goBack()}
              />
              <Text color='highContrastText'>
                {props.options.title || props.route.name}
              </Text>
              <Box>
                {props.options.headerRight && props.options.headerRight({})}
              </Box>
            </Box>
          ),
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator
        }}
      >
        <RootStack.Screen name='NewCategory' component={NewCategory} />
        <RootStack.Screen name='NewBill' component={NewBill} />
      </RootStack.Group>
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureDirection: 'vertical',
          gestureEnabled: true,
          gestureResponseDistance: 70,
          cardStyleInterpolator: defaultModalStyleInterpolator
        }}>
        <RootStack.Screen name='SplitModal' component={SplitTransaction} />
        <RootStack.Screen name='PickerCard' component={CardPicker} />
        <RootStack.Screen name='PickAccount' component={AccountsPicker} />
        <RootStack.Screen name='Holdings' component={Holdings} />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default ModalScreens
