import { View } from 'react-native';
import {
  Users,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  Link,
} from 'geist-native-icons';

import styles from './styles/navigator';
import { Box, Seperator } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import {
  Avatar,
  Text,
  ChevronTouchable,
  Button,
  Icon,
} from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';

function Profile(props: ProfileScreenProps<'Main'>) {
  const { data: user } = useGetMeQuery();

  return (
    <Box variant="nestedScreen">
      <Box paddingTop="l">
        <Avatar size="xl" name={user?.name} />
        <Button
          onPress={() =>
            props.navigation.navigate('Modals', { screen: 'EditPersonalInfo' })
          }
        >
          <View style={styles.userInfo}>
            <Text color="highContrastText">
              {user?.name.first} {user?.name.last}
            </Text>
            <Text color="tertiaryText">{user?.email}</Text>
          </View>
        </Button>
      </Box>
      <Box
        backgroundColor="nestedContainer"
        variant="nestedContainer"
        style={styles.optionsContainer}
      >
        <ChevronTouchable
          onPress={() =>
            user?.co_owner
              ? props.navigation.navigate('CoOwner')
              : props.navigation.navigate('Modals', { screen: 'AddCoOwner' })
          }
        >
          <Icon color="secondaryText" icon={Users} />
          <Text>Account Member</Text>
        </ChevronTouchable>
        <Seperator backgroundColor="nestedContainerSeperator" />
        <ChevronTouchable
          onPress={() =>
            props.navigation.navigate('Connections', { screen: 'All' })
          }
        >
          <Icon color="secondaryText" icon={Link} />
          <Text>Connections</Text>
        </ChevronTouchable>
        <Seperator backgroundColor="nestedContainerSeperator" />
        <ChevronTouchable
          onPress={() =>
            props.navigation.navigate('Security', { screen: 'Main' })
          }
        >
          <Icon color="secondaryText" icon={Shield} />
          <Text>Security</Text>
        </ChevronTouchable>
        <Seperator backgroundColor="nestedContainerSeperator" />
        <ChevronTouchable onPress={() => props.navigation.navigate('Settings')}>
          <Icon color="secondaryText" icon={SettingsIcon} />
          <Text>Settings</Text>
        </ChevronTouchable>
      </Box>
      <Button
        onPress={() =>
          props.navigation.navigate('Modals', { screen: 'Logout' })
        }
        style={styles.logoutButton}
        label={'Logout'}
        backgroundColor="transparent"
        borderColor="transparent"
        textColor="blueText"
        labelPlacement="left"
        icon={<Icon strokeWidth={2} icon={LogOut} size={18} color="blueText" />}
      />
    </Box>
  );
}

export default Profile;
