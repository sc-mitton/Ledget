import { View, TouchableOpacity } from 'react-native';
import { Trash2 } from 'geist-native-icons';

import styles from './styles';
import {
  useGetCoOwnerQuery,
  useGetMeQuery,
  useGetPlaidItemsQuery,
} from '@ledget/shared-features';
import {
  Text,
  Header2,
  Avatar,
  Seperator,
  Box,
  InstitutionLogo,
  Icon,
} from '@ledget/native-ui';
import { ProfileScreenProps } from '@types';

const Screen = (props: ProfileScreenProps<'CoOwner'>) => {
  const { data: coOwner } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();
  const { data: plaidItems } = useGetPlaidItemsQuery();

  return (
    <Box style={styles.screen} variant="nestedScreen">
      <View style={styles.avatarContainer}>
        <Avatar name={coOwner?.name} size="xl" />
        <Header2 style={styles.header}>
          {coOwner && `${coOwner?.name.first} ${coOwner?.name.last}`}
        </Header2>
        <Text color="secondaryText">{coOwner?.email}</Text>
      </View>
      <Box style={styles.container} variant="nestedContainer">
        <View style={styles.accountsContainer}>
          <Text>{`${coOwner?.name.first}'s Accounts`}</Text>
          {plaidItems?.filter((item) => item.user === coOwner?.id).length ===
          0 ? (
            <View style={styles.emptyAccounts}>
              <Text color="tertiaryText">No accounts connected</Text>
            </View>
          ) : (
            <View style={styles.accounts}>
              {plaidItems
                ?.filter((item) => item.user === coOwner?.id)
                .map((item) => (
                  <View style={styles.logo} key={`logo-${item.id}`}>
                    <InstitutionLogo
                      size={26}
                      key={item.id}
                      data={item.institution?.logo}
                    />
                  </View>
                ))}
            </View>
          )}
        </View>
        <Seperator backgroundColor="nestedContainerSeperator" />
        <View style={styles.accountsContainer}>
          <Text>Your Accounts</Text>
          {plaidItems?.filter((item) => item.user === user?.id).length === 0 ? (
            <View style={styles.emptyAccounts}>
              <Text color="tertiaryText">You have no accounts connected</Text>
            </View>
          ) : (
            <View style={styles.accounts}>
              {plaidItems
                ?.filter((item) => item.user === user?.id)
                .map((item) => (
                  <Box
                    borderColor="nestedContainer"
                    borderWidth={2.5}
                    borderRadius="circle"
                    style={styles.logo}
                    key={`logo-${item.id}`}
                  >
                    <InstitutionLogo
                      size={26}
                      key={item.id}
                      data={item.institution?.logo}
                    />
                  </Box>
                ))}
            </View>
          )}
        </View>
        <Seperator backgroundColor="nestedContainerSeperator" />
        <Text variant="footer">
          Only you can add or remove your accounts. Another account member can
          only view the accounts you have connected.
        </Text>
      </Box>
      {user?.is_account_owner && (
        <TouchableOpacity
          style={styles.removeButton}
          activeOpacity={0.7}
          onPress={() => {
            props.navigation.navigate('Modals', {
              screen: 'ConfirmRemoveCoowner',
            });
          }}
        >
          <Icon icon={Trash2} color="blueText" />
          <Text color="blueText">Remove</Text>
        </TouchableOpacity>
      )}
    </Box>
  );
};

export default Screen;
