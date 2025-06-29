import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, AlertCircle } from 'geist-native-icons';
import { createStackNavigator } from '@react-navigation/stack';

import styles from './styles/screen';
import {
  PulseBox,
  Text,
  Seperator,
  ChevronTouchable,
  Icon,
  InstitutionLogo,
  BoxHeader,
} from '@ledget/native-ui';
import {
  useGetCoOwnerQuery,
  useGetMeQuery,
  useGetPlaidItemsQuery,
} from '@ledget/shared-features';
import { ConnectionsScreenProps, ConnectionsStackParamList } from '@types';
import { usePlaidLink } from '@hooks';
import { BackHeader, Box } from '@ledget/native-ui';
import { useCardStyleInterpolator } from '@/hooks';
import Connection from './Connection/Screen';
import { Fragment } from 'react';

const Stack = createStackNavigator<ConnectionsStackParamList>();

const Connections = ({ navigation, route }: ConnectionsScreenProps<'All'>) => {
  const { data: user } = useGetMeQuery();
  const { data: coOwner } = useGetCoOwnerQuery();
  const { data: plaidItems, isLoading } = useGetPlaidItemsQuery();
  const { openLink } = usePlaidLink();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box variant="nestedScreen">
        <BoxHeader>Your Connections</BoxHeader>
        <PulseBox
          pulsing={isLoading}
          numberOfLines={4}
          variant="nestedContainer"
          backgroundColor="nestedContainer"
          style={styles.container}
        >
          {plaidItems?.length || 0 > 0 ? (
            plaidItems
              ?.filter((item) => item.user === user?.id)
              .map((item, i) => (
                <Fragment key={`connection-${i}`}>
                  <View style={styles.row}>
                    <ChevronTouchable
                      onPress={() =>
                        navigation.navigate('Connection', { item: item.id })
                      }
                    >
                      {item.login_required ? (
                        <Icon
                          icon={AlertCircle}
                          color="alert"
                          strokeWidth={2}
                        />
                      ) : (
                        <InstitutionLogo institution={item.institution?.id} />
                      )}
                      <Text color={item.login_required ? 'alert' : 'mainText'}>
                        {item.institution?.name}
                      </Text>
                    </ChevronTouchable>
                  </View>
                  {i <
                    plaidItems?.filter((item) => item.user === user?.id)
                      .length -
                      1 && (
                    <Seperator
                      variant="bare"
                      backgroundColor="nestedContainerSeperator"
                    />
                  )}
                </Fragment>
              ))
          ) : (
            <Text color="quinaryText">No connections</Text>
          )}
        </PulseBox>
        {user?.co_owner && (
          <Fragment>
            {coOwner && (
              <BoxHeader>{coOwner?.name.first}'s Connections</BoxHeader>
            )}
            <PulseBox
              pulsing={isLoading}
              numberOfLines={4}
              variant="nestedContainer"
              backgroundColor="nestedContainer"
              style={styles.container}
            >
              <Box width="100%">
                {plaidItems
                  ?.filter((item) => item.user === coOwner?.id)
                  .map((item, i) => (
                    <Fragment key={`connection-${i}`}>
                      <View style={styles.row}>
                        <ChevronTouchable
                          onPress={() =>
                            navigation.navigate('Connection', { item: item.id })
                          }
                        >
                          <InstitutionLogo data={item.institution?.logo} />
                          <Text>{item.institution?.name}</Text>
                        </ChevronTouchable>
                      </View>
                      <Seperator
                        variant="bare"
                        backgroundColor="nestedContainerSeperator"
                      />
                    </Fragment>
                  ))}
                {plaidItems?.filter((item) => item.user === coOwner?.id)
                  .length === 0 && (
                  <Text color="quinaryText">No connections</Text>
                )}
              </Box>
            </PulseBox>
          </Fragment>
        )}
        <Box
          variant="nestedContainer"
          backgroundColor="nestedContainer"
          style={styles.addButtonContainer}
        >
          <View style={[styles.row]}>
            <TouchableOpacity
              onPress={openLink}
              activeOpacity={0.7}
              style={styles.addButton}
            >
              <Text color="secondaryText">Add Connection</Text>
              <View style={styles.iconContainer}>
                <Icon icon={Plus} color="quinaryText" strokeWidth={2} />
              </View>
            </TouchableOpacity>
          </View>
        </Box>
        <Text variant="footer" paddingHorizontal="s">
          Connections to your financial institutions are mantained by Plaid. You
          can add or remove connections at any time. Ledget does not store your
          financial institution credentials. Plaid uses a security identifier
          provided by your financial institution to access your account.
        </Text>
      </Box>
    </ScrollView>
  );
};

const ConnectionsStack = () => {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="All"
        component={Connections}
      />
      <Stack.Screen name="Connection" component={Connection} />
    </Stack.Navigator>
  );
};

export default ConnectionsStack;
