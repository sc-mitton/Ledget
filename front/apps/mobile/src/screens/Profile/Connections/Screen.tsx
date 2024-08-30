import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from 'geist-native-icons';
import { createStackNavigator } from "@react-navigation/stack";

import styles from './styles/connections'
import { ShimmerBox, Text, Seperator, ChevronTouchable, Icon, InstitutionLogo } from '@ledget/native-ui';
import { useGetCoOwnerQuery, useGetMeQuery, useGetPlaidItemsQuery } from '@ledget/shared-features';
import { ConnectionsScreenProps, ConnectionsStackParamList } from '@types';
import { usePlaidLink } from '@hooks';
import { BackHeader, Header2, Box } from '@ledget/native-ui';
import { useCardStyleInterpolator } from "@/hooks";
import Connection from './Connection/Screen';

const Stack = createStackNavigator<ConnectionsStackParamList>();

const Connections = ({
  navigation,
  route
}: ConnectionsScreenProps<'All'>) => {
  const { data: user } = useGetMeQuery()
  const { data: coOwner } = useGetCoOwnerQuery()
  const { data: plaidItems, isLoading } = useGetPlaidItemsQuery()
  const { openLink } = usePlaidLink()

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box variant='screenWithHeader' marginTop='xxxl' style={styles.content}>
        <ShimmerBox
          shimmering={isLoading}
          numberOfLines={4}
          variant='nestedContainer'
          backgroundColor='nestedContainer'
          style={styles.container}
        >
          <Text>Your Connections</Text>
          <Seperator variant='bare' />
          {plaidItems?.filter((item) => item.user === user?.id).map((item, i) => (
            <>
              <View style={styles.row} key={`connection-${i}`}>
                <ChevronTouchable onPress={() => navigation.navigate('Connection', { item: item.id })}>
                  <InstitutionLogo data={item.institution?.logo} />
                  <Text>{item.institution?.name}</Text>
                </ChevronTouchable>
              </View>
              {i < plaidItems?.filter((item) => item.user === user?.id).length - 1 &&
                <Seperator variant='bare' />}
            </>
          ))}
        </ShimmerBox>
        {user?.co_owner && (
          <ShimmerBox
            shimmering={isLoading}
            numberOfLines={4}
            variant='nestedContainer'
            backgroundColor='nestedContainer'
            style={styles.container}
          >
            <Box width='100%'>
              <Text>{coOwner?.name.first}'s Connections</Text>
              <Seperator />
              {plaidItems?.filter((item) => item.user === coOwner?.id).map((item, i) => (
                <>
                  <View style={styles.row} key={`connection-${i}`}>
                    <ChevronTouchable onPress={() => navigation.navigate('Connection', { item: item.id })}>
                      <InstitutionLogo data={item.institution?.logo} />
                      <Text>{item.institution?.name}</Text>
                    </ChevronTouchable>
                  </View>
                  <Seperator variant='bare' />
                </>
              ))}
              {plaidItems?.filter((item) => item.user === coOwner?.id).length === 0 && (
                <Text variant='footer'>
                  {coOwner?.name.first} has not added any connections yet.
                </Text>
              )}
            </Box>
          </ShimmerBox>
        )}
        <Box variant='nestedContainer' backgroundColor='nestedContainer'>
          <View style={[styles.row]}>
            <TouchableOpacity
              onPress={openLink}
              activeOpacity={0.7}
              style={styles.addButton}>
              <Text color='secondaryText'>Add Connection</Text>
              <View style={styles.iconContainer}>
                <Icon icon={Plus} color='quinaryText' />
              </View>
            </TouchableOpacity>
          </View>
        </Box>
        <Text variant='footer' paddingHorizontal='s'>
          Connections to your financial institutions are mantained by Plaid. You can add or remove connections at any time.
          Ledget does not store your financial institution credentials. Plaid uses a security identifier provided by your
          financial institution to access your account.
        </Text>
      </Box>
    </ScrollView>
  )
}

const ConnectionsStack = () => {
  const cardStyleInterpolator = useCardStyleInterpolator()

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
      id='connections'
    >
      <Stack.Screen options={{ headerShown: false }} name='All' component={Connections} />
      <Stack.Screen name='Connection' component={Connection} />
    </Stack.Navigator>
  )
}

export default ConnectionsStack
