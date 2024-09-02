import { LogOut } from 'geist-native-icons';
import { ScrollView, View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";

import styles from './styles/screen';
import { Box, Header } from '@ledget/native-ui';
import Devices from './Devices';
import Mfa from './Auth';
import { SecurityScreenProps, SecurityStackParamList } from '@types';
import { Button, Icon, BackHeader } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";
import Device from './Device/Screen';

const Stack = createStackNavigator<SecurityStackParamList>();

const Screen = (props: SecurityScreenProps<'Main'>) => {

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box variant='nestedScreen'>
        <Mfa {...props} />
        <Devices {...props} />
        <View style={styles.logoutButton}>
          <Button
            onPress={() => props.navigation.navigate('Modals', { screen: "LogoutAllDevices" })}
            label={'Logout All Devices'}
            backgroundColor='transparent'
            borderColor='transparent'
            textColor='blueText'
            variant='borderedGrayMain'>
            <Icon icon={LogOut} size={18} color='blueText' />
          </Button>
        </View>
      </Box>
    </ScrollView>
  );
}

const ScreenStack = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
      id='security'
      initialRouteName='Main'
    >
      <Stack.Screen options={{ headerShown: false }} name='Main' component={Screen} />
      <Stack.Screen name='Device' component={Device} />
    </Stack.Navigator>
  )
}

export default ScreenStack
