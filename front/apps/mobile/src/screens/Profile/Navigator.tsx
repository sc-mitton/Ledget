import { View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { Users, Settings as SettingsIcon, Shield, LogOut, Link } from 'geist-native-icons';

import styles from './styles/navigator';
import { Header, Box, Seperator } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetDevicesQuery, useGetMeQuery, useGetPlaidItemsQuery } from '@ledget/shared-features';
import { Avatar, Text, ChevronTouchable, Button } from '@ledget/native-ui';
import { ProfileStackParamList } from '@types';
import { BackHeader, Icon } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";
import { ProfileScreenProps } from '@types';
import Security from './Security/Screen';
import Settings from './Settings/Screen';
import Connections from './Connections/Screen';
import CoOwner from './CoOwner/Screen';


const Stack = createStackNavigator<ProfileStackParamList>();

function Profile(props: ProfileScreenProps<'Main'>) {
  const { data: user } = useGetMeQuery();

  return (
    <Box variant='screen'>
      <View>
        <Header>Profile</Header>
        <View>
          <Box
            paddingHorizontal='s'
            paddingVertical='l'
            style={styles.userInfoContainer}>
            <ChevronTouchable onPress={() => props.navigation.navigate('Modals', { screen: 'EditPersonalInfo' })}>
              <Avatar size='l' name={user?.name} />
              <View style={styles.userInfo}>
                <Text color='highContrastText'>{user?.name.first} {user?.name.last}</Text>
                <Text color='tertiaryText'>{user?.email}</Text>
              </View>
            </ChevronTouchable>
          </Box>
        </View>
      </View>
      <Box
        backgroundColor='nestedContainer'
        variant='nestedContainer'
        style={styles.optionsContainer}
      >
        <ChevronTouchable onPress={() =>
          user?.co_owner
            ? props.navigation.navigate('CoOwner')
            : props.navigation.navigate('Modals', { screen: 'AddCoOwner' })
        }>
          <Icon color='secondaryText' icon={Users} />
          <Text>Account Member</Text>
        </ChevronTouchable>
        <Seperator backgroundColor='nestedContainerSeperator' />
        <ChevronTouchable onPress={() => props.navigation.navigate('Connections', { screen: 'All' })}>
          <Icon color='secondaryText' icon={Link} />
          <Text>Connections</Text>
        </ChevronTouchable>
        <Seperator backgroundColor='nestedContainerSeperator' />
        <ChevronTouchable onPress={() => props.navigation.navigate('Security', { screen: 'Main' })}>
          <Icon color='secondaryText' icon={Shield} />
          <Text>Security</Text>
        </ChevronTouchable>
        <Seperator backgroundColor='nestedContainerSeperator' />
        <ChevronTouchable onPress={() => props.navigation.navigate('Settings')}>
          <Icon color='secondaryText' icon={SettingsIcon} />
          <Text>Settings</Text>
        </ChevronTouchable>
      </Box>
      <Button
        onPress={() => props.navigation.navigate('Modals', { screen: 'Logout' })}
        style={styles.logoutButton}
        label={'Logout'}
        backgroundColor='transparent'
        borderColor='transparent'
        textColor='blueText'
        labelPlacement='left'
        icon={<Icon strokeWidth={2} icon={LogOut} size={18} color='blueText' />}
      />
    </Box>
  );
}

export default function Navigator() {
  const cardStyleInterpolator = useCardStyleInterpolator();

  // Get coowner, connections, devices so that it's preloaded
  useGetDevicesQuery();
  useGetCoOwnerQuery();
  useGetPlaidItemsQuery();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          return (
            <BackHeader  {...props} pagesWithTitle={['Security', 'Settings', 'Connections']} />
          );
        },
        cardStyleInterpolator
      }}
      initialRouteName='Main'
    >
      <Stack.Screen options={{ headerShown: false }} name='Main' component={Profile} />
      <Stack.Screen name='Security' component={Security} />
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='CoOwner' component={CoOwner} />
      <Stack.Screen name='Connections' component={Connections} />
    </Stack.Navigator>
  );
}
